// Archivo: app/api/leads/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Lead from "@/models/Leads";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();

    // 1. LA SOLUCIÓN AL ERROR ROJO: Le ponemos 'await' a params
    const { id } = await params;

    const body = await request.json();
    const { estado } = body;

    if (!estado) {
      return NextResponse.json({ error: "Falta el estado a actualizar" }, { status: 400 });
    }

    // 2. LA SOLUCIÓN AL AVISO NARANJA: Usamos returnDocument: 'after'
    const leadActualizado = await Lead.findByIdAndUpdate(
      id,
      { estado: estado },
      { returnDocument: "after" }
    );

    if (!leadActualizado) {
      return NextResponse.json({ error: "Lead no encontrado" }, { status: 404 });
    }

    return NextResponse.json(
      { mensaje: "¡Estado actualizado en BD!", lead: leadActualizado },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
