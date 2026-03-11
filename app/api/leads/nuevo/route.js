// Archivo: app/api/leads/nuevo/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/models/Leads";

// 1. Damos permiso a WordPress para enviarnos datos (CORS)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Cambia el "*" por "https://tu-wordpress.com" en producción para más seguridad
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// 2. Gestionamos la pre-petición de seguridad del navegador
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// 3. Recibimos el formulario
export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Validamos lo básico
    if (!data.email || !data.nombre) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Creamos el Lead
    const nuevoLead = await Lead.create({
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      cursos: data.cursos || [],
      estado: "Nuevo", // Entra por defecto como Nuevo
    });

    return NextResponse.json(
      { mensaje: "Lead guardado con éxito", lead: nuevoLead },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error al guardar Lead:", error);
    // Controlamos si el email ya dejó sus datos antes
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Este email ya está registrado en nuestro sistema." },
        { status: 400, headers: corsHeaders }
      );
    }
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500, headers: corsHeaders }
    );
  }
}
