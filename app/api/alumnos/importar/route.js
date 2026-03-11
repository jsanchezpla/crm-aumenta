// Archivo: app/api/alumnos/importar/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";

export async function POST(request) {
  try {
    await dbConnect();

    // Recibimos la empresa y el array de emails desde el frontend
    const { empresa, emails } = await request.json();

    if (!empresa || !emails || emails.length === 0) {
      return NextResponse.json({ error: "Faltan datos o el archivo está vacío" }, { status: 400 });
    }

    // Preparamos los objetos de forma limpia, SOLO con lo necesario
    const alumnosNuevos = emails.map((email) => ({
      email: email.trim().toLowerCase(),
      tipoPerfil: "Empresa",
      perfil: "Empresa",
      profesion: empresa,
      activo: false,
    }));

    // Insertamos todos omitiendo los que ya existan
    await Student.insertMany(alumnosNuevos, { ordered: false });

    return NextResponse.json(
      { mensaje: `¡Se han importado los alumnos de ${empresa} con éxito!` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al importar alumnos:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { mensaje: "Importación terminada, pero se omitieron emails que ya existían." },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: "Error del servidor al importar" }, { status: 500 });
  }
}
