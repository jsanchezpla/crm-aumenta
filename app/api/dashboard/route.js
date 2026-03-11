// Archivo: app/api/dashboard/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/models/Leads";
import Student from "@/models/Student";
import Purchase from "@/models/Purchase";
import Material from "@/models/Material"; // 1. Importamos el nuevo modelo

export async function GET(request) {
  try {
    // 1. Conectamos a la base de datos
    await dbConnect();

    // Extraemos Leads y Alumnos
    const leadsDB = await Lead.find({}).sort({ createdAt: -1 }).lean();
    const alumnosDB = await Student.find({}).sort({ createdAt: -1 }).lean();

    // Extraemos Ventas (Cursos)
    const ventasDB = await Purchase.find({})
      .populate("alumno", "nombre apellidos")
      .sort({ createdAt: -1 })
      .lean();

    // 2. EXTRAEMOS LOS MATERIALES (Usamos populate igual que en ventas)
    const materialesDB = await Material.find({})
      .populate("alumno", "nombre apellidos")
      .sort({ createdAt: -1 })
      .lean();

    // Formateamos los datos para que el frontend no se rompa
    const leads = leadsDB.map((l) => ({ ...l, id: l._id.toString() }));
    const alumnos = alumnosDB.map((a) => ({
      ...a,
      id: a._id.toString(),
      perfil: a.tipoPerfil || "Privado",
    }));

    const ventas = ventasDB.map((v) => {
      const fechaObj = new Date(v.fechaCompra);
      const fechaFormateada = fechaObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return {
        ...v,
        id: v._id.toString(),
        alumno: v.alumno
          ? `${v.alumno.nombre} ${v.alumno.apellidos || ""}`.trim()
          : "Alumno Borrado",
        curso: v.nombreCurso,
        importe: `${v.precio}€`,
        fecha: fechaFormateada,
      };
    });

    // 3. FORMATEAMOS LOS MATERIALES
    const materiales = materialesDB.map((m) => {
      // Formateamos la fecha al estilo español
      const fechaObj = new Date(m.fechaCompra);
      const fechaFormateada = fechaObj.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return {
        ...m,
        id: m._id.toString(),
        // Extraemos el nombre completo del alumno y lo guardamos en alumnoNombre
        // por si alguna vez el alumno ha sido borrado de la BD, que no nos dé error
        alumnoNombre: m.alumno
          ? `${m.alumno.nombre} ${m.alumno.apellidos || ""}`.trim()
          : "Alumno Borrado",
        fechaCompraStr: fechaFormateada,
      };
    });

    // 4. Enviamos el paquete completo al Dashboard INCLUYENDO LOS MATERIALES
    return NextResponse.json({ leads, alumnos, ventas, materiales }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener datos del Dashboard:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
