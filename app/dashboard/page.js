"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import StudentModal from "../components/dashboard/StudentModal";
import LeadModal from "../components/dashboard/LeadModal";
import SealModal from "../components/dashboard/SealModal";
import VentasView from "../components/dashboard/SealView";
import StudentView from "../components/dashboard/StudentView";
import LeadsView from "../components/dashboard/LeadsView";
import StatsView from "../components/dashboard/StatsView";
import { exportarAExcel } from "@/lib/exportExcel";

export default function Dashboard() {
  const router = useRouter();
  const [vistaActiva, setVistaActiva] = useState("estadisticas");
  const [usuarioEmail, setUsuarioEmail] = useState("");

  // --- ESTADOS PARA LA INTERFAZ ---
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenColumna, setOrdenColumna] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [filtroCursoVentas, setFiltroCursoVentas] = useState("");
  const [filtroCursoLeads, setFiltroCursoLeads] = useState("");
  const [filtroEmpresa, setFiltroEmpresa] = useState("");

  // Inicializar cargando basado en la presencia del token
  const [cargando, setCargando] = useState(
    typeof window !== "undefined" && !localStorage.getItem("crm_token")
  );

  // Limpiar el buscador y el ordenamiento cada vez que cambiamos de pestaña
  useEffect(() => {
    setBusqueda("");
    setOrdenColumna(null);
    setOrdenAscendente(true);
  }, [vistaActiva]);

  const [leads, setLeads] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [ventas, setVentas] = useState([]);

  // --- LÓGICA DE PROCESAMIENTO PARA VENTAS ---
  let ventasProcesadas = ventas.filter((v) => {
    // 1. Filtro de Texto (Buscador general)
    const term = (busqueda || "").toLowerCase();
    const coincideTexto =
      (v.alumno || "").toLowerCase().includes(term) ||
      (v.curso || "").toLowerCase().includes(term) ||
      (v.importe || "").toLowerCase().includes(term) ||
      (v.fecha || "").toLowerCase().includes(term);

    // 2. Filtro Desplegable (Exacto)
    const coincideCursoVenta = filtroCursoVentas === "" || v.curso === filtroCursoVentas;

    // 3. Tienen que cumplirse AMBAS condiciones
    return coincideTexto && coincideCursoVenta;
  });

  const cursosUnicosVentas = [...new Set(ventas.map((v) => v.curso).filter(Boolean))];

  if (ordenColumna && vistaActiva === "ventas") {
    ventasProcesadas.sort((a, b) => {
      let vA, vB;
      switch (ordenColumna) {
        case "fecha":
          vA = new Date(a.fecha).getTime();
          vB = new Date(b.fecha).getTime();
          break;
        case "alumno":
          vA = a.alumno.toLowerCase();
          vB = b.alumno.toLowerCase();
          break;
        case "curso":
          vA = a.curso.toLowerCase();
          vB = b.curso.toLowerCase();
          break;
        case "importe":
          vA = parseFloat(a.importe);
          vB = parseFloat(b.importe);
          break; // Lo pasa a número para ordenar bien
        default:
          return 0;
      }
      if (vA < vB) return ordenAscendente ? -1 : 1;
      if (vA > vB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  // --- LÓGICA DE PROCESAMIENTO PARA ALUMNOS ---

  if (ordenColumna && vistaActiva === "alumnos") {
    alumnosProcesados.sort((a, b) => {
      let vA, vB;
      switch (ordenColumna) {
        case "usuario":
          vA = a.username.toLowerCase();
          vB = b.username.toLowerCase();
          break;
        case "nombre":
          vA = a.nombre.toLowerCase();
          vB = b.nombre.toLowerCase();
          break;
        case "perfil":
          vA = (a.perfil || "").toLowerCase();
          vB = (b.perfil || "").toLowerCase();
          break;
        case "activo":
          vA = a.activo ? 1 : 0;
          vB = b.activo ? 1 : 0;
          break;
        default:
          return 0;
      }
      if (vA < vB) return ordenAscendente ? -1 : 1;
      if (vA > vB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  // 1. Estado para guardar qué empresa hemos seleccionado en el desplegable

  // 2. Extraer empresas únicas usando el campo 'profesion' cuando son 'Empresa'
  // (Nota: Usamos a.perfil o a.tipoPerfil dependiendo de cómo lo mande tu API)
  const empresasUnicas = [
    ...new Set(
      alumnos
        .filter((a) => (a.perfil === "Empresa" || a.tipoPerfil === "Empresa") && a.profesion)
        .map((a) => a.profesion)
    ),
  ];

  // 3. Lógica de filtrado combinada (Texto + Desplegable)
  let alumnosProcesados = alumnos.filter((a) => {
    // Filtro de texto (nombre, email, etc.)
    const term = (busqueda || "").toLowerCase();
    const coincideTexto =
      a.nombre?.toLowerCase().includes(term) ||
      a.email?.toLowerCase().includes(term) ||
      a.apellidos?.toLowerCase().includes(term);

    // Filtro de empresa: Si el desplegable está vacío, pasan todos.
    // Si tiene algo, el alumno DEBE ser de empresa y su profesión coincidir.
    const esEmpresa = a.perfil === "Empresa" || a.tipoPerfil === "Empresa";
    const coincideEmpresa = filtroEmpresa === "" || (esEmpresa && a.profesion === filtroEmpresa);

    return coincideTexto && coincideEmpresa;
  });

  // (Aquí debajo mantienes tu código para ordenar columnas si lo tenías)

  // --- LÓGICA DE PROCESAMIENTO PARA LEADS ---
  let leadsProcesados = leads.filter((l) => {
    // 1. Filtro de Texto (Buscador general)
    const term = (busqueda || "").toLowerCase();
    const coincideTexto =
      (l.nombre || "").toLowerCase().includes(term) ||
      (l.apellidos || "").toLowerCase().includes(term) ||
      (l.email || "").toLowerCase().includes(term);

    // 2. Filtro Desplegable (Cursos en Leads es un array, así que usamos .includes)
    const coincideCursoLead = filtroCursoLeads === "" || l.cursos.includes(filtroCursoLeads);

    // 3. Tienen que cumplirse AMBAS condiciones
    return coincideTexto && coincideCursoLead;
  });

  const cursosUnicosLeads = [...new Set(leads.flatMap((l) => l.cursos).filter(Boolean))];

  if (ordenColumna && vistaActiva === "leads") {
    leadsProcesados.sort((a, b) => {
      let vA, vB;
      switch (ordenColumna) {
        case "nombre":
          vA = a.nombre.toLowerCase();
          vB = b.nombre.toLowerCase();
          break;
        // Para ordenar, juntamos los cursos en un solo texto separado por comas
        case "curso":
          vA = a.cursos.join(", ").toLowerCase();
          vB = b.cursos.join(", ").toLowerCase();
          break;
        case "estado":
          vA = a.estado.toLowerCase();
          vB = b.estado.toLowerCase();
          break;
        default:
          return 0;
      }
      if (vA < vB) return ordenAscendente ? -1 : 1;
      if (vA > vB) return ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  const handleUpdateEstado = async (id, nuevoEstado) => {
    // 1. ACTUALIZACIÓN OPTIMISTA: Cambiamos el estado en pantalla al instante
    // para que el usuario no note ningún "lag" mientras el servidor piensa.
    setLeads(leads.map((lead) => (lead.id === id ? { ...lead, estado: nuevoEstado } : lead)));

    // 2. ACTUALIZACIÓN REAL (Base de datos)
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (!response.ok) {
        console.error("Error al guardar en la base de datos");
        // Opcional: Si falla, podrías volver a poner el estado anterior aquí
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const manejarOrden = (columna) => {
    if (ordenColumna === columna) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setOrdenColumna(columna);
      setOrdenAscendente(true);
    }
  };

  const FlechaOrden = ({ columna }) => {
    if (ordenColumna !== columna)
      return (
        <span className="text-gray-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
          ↕
        </span>
      );
    return ordenAscendente ? (
      <span className="text-[#FF0188] ml-1">↑</span>
    ) : (
      <span className="text-[#FF0188] ml-1">↓</span>
    );
  };

  useEffect(() => {
    const cargarDatos = async () => {
      const token = localStorage.getItem("crm_token");
      const emailGuardado = localStorage.getItem("crm_email");

      // 1. Control de seguridad
      if (!token) {
        router.push("/");
        return;
      }
      if (emailGuardado) setUsuarioEmail(emailGuardado);

      // 2. Llamada a tu nueva API
      try {
        const res = await fetch("/api/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Le pasamos el token por seguridad
          },
        });

        if (res.ok) {
          const data = await res.json();
          // 3. ¡Inyectamos los datos reales en el Dashboard!
          setLeads(data.leads);
          setAlumnos(data.alumnos);
          setVentas(data.ventas);
        } else {
          // Si el token ha caducado o hay un error, le echamos al login
          if (res.status === 401) {
            localStorage.removeItem("crm_token");
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error cargando la base de datos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_email");
    router.push("/");
  };

  if (cargando)
    return (
      <div className="min-h-screen bg-[#fcfaff] flex items-center justify-center text-[#40269A] font-bold text-xl animate-pulse">
        Cargando tu espacio Aumenta...
      </div>
    );

  const getBadgeColor = (estado) => {
    switch (estado) {
      case "Nuevo":
        return "bg-[#FFDAED] text-[#FF0188] border border-[#FF0188]/20";
      case "Contactado":
        return "bg-[#DEC7FF] text-[#40269A] border border-[#40269A]/20";
      case "Empresa":
        return "bg-blue-100 text-blue-700";
      case "Privado":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] flex font-glacial relative">
      <Sidebar
        vistaActiva={vistaActiva}
        setVistaActiva={setVistaActiva}
        handleLogout={handleLogout}
      />

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white p-8 shadow-sm flex justify-between items-center z-0 shrink-0 border-b border-gray-100">
          <h1 className="text-3xl font-black text-[#40269A] tracking-tight">
            {vistaActiva === "estadisticas" && "Análisis y Rendimiento"}
            {vistaActiva === "leads" && "Gestión de Prospectos"}
            {vistaActiva === "alumnos" && "Directorio de Alumnos"}
            {vistaActiva === "ventas" && "Historial de Ventas"}
          </h1>
          <div className="text-sm font-bold text-[#40269A] bg-[#DEC7FF]/30 px-6 py-3 rounded-full border border-[#C49DFF]/50">
            {usuarioEmail || "Cargando..."}
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto bg-gradient-to-br from-[#fcfaff] to-[#DEC7FF]/10">
          <div className="bg-white p-8 lg:p-12 rounded-[2rem] shadow-xl border-t-[8px] border-[#FFDAED] min-h-full relative">
            {/* VISTA ESTADÍSTICAS */}
            {vistaActiva === "estadisticas" && (
              <StatsView leads={leads} alumnos={alumnos} ventas={ventas} />
            )}

            {/* ========================================================= */}
            {/* VISTA LEADS COMPLETADA CON BUSCADOR Y ORDENACIÓN */}
            {/* ========================================================= */}
            {vistaActiva === "leads" && (
              <LeadsView
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                leadsProcesados={leadsProcesados}
                manejarOrden={manejarOrden}
                FlechaOrden={FlechaOrden}
                setLeadSeleccionado={setLeadSeleccionado}
                getBadgeColor={getBadgeColor}
                filtroCurso={filtroCursoLeads}
                setFiltroCurso={setFiltroCursoLeads}
                cursosUnicos={cursosUnicosLeads}
                onExportar={() => exportarAExcel(leadsProcesados, "Leads_Aumenta", "leads")}
              />
            )}

            {/* ========================================================= */}
            {/* VISTA ALUMNOS (Mantenemos la que ya funcionaba perfecta) */}
            {/* ========================================================= */}
            {vistaActiva === "alumnos" && (
              <StudentView
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                alumnosProcesados={alumnosProcesados}
                manejarOrden={manejarOrden}
                FlechaOrden={FlechaOrden}
                setAlumnoSeleccionado={setAlumnoSeleccionado}
                getBadgeColor={getBadgeColor}
                filtroEmpresa={filtroEmpresa}
                setFiltroEmpresa={setFiltroEmpresa}
                empresasUnicas={empresasUnicas}
                onExportar={() => exportarAExcel(alumnosProcesados, "Alumnos_Aumenta", "alumnos")}
              />
            )}

            {/* ========================================================= */}
            {/* VISTA VENTAS COMPLETADA CON BUSCADOR Y ORDENACIÓN */}
            {/* ========================================================= */}
            {vistaActiva === "ventas" && (
              <VentasView
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                ventasProcesadas={ventasProcesadas}
                manejarOrden={manejarOrden}
                FlechaOrden={FlechaOrden}
                setVentaSeleccionada={setVentaSeleccionada}
                filtroCurso={filtroCursoVentas}
                setFiltroCurso={setFiltroCursoVentas}
                cursosUnicos={cursosUnicosVentas}
                onExportar={() => exportarAExcel(ventasProcesadas, "Ventas_Aumenta", "ventas")}
              />
            )}
          </div>
        </div>
      </main>

      {/* ========================================================= */}
      {/* VENTANA MODAL 1: FICHA DE ALUMNO (La que ya teníamos) */}
      {/* ========================================================= */}
      <StudentModal
        alumno={alumnoSeleccionado}
        onClose={() => setAlumnoSeleccionado(null)}
        getBadgeColor={getBadgeColor}
      />

      {/* ========================================================= */}
      {/* VENTANA MODAL 2: FICHA DE LEAD (Nueva, enfocada a ventas) */}
      {/* ========================================================= */}
      <LeadModal
        lead={leadSeleccionado}
        onClose={() => setLeadSeleccionado(null)}
        getBadgeColor={getBadgeColor}
        onUpdateEstado={handleUpdateEstado}
      />

      {/* ========================================================= */}
      {/* VENTANA MODAL 3: RECIBO DE VENTA */}
      {/* ========================================================= */}
      <SealModal seal={ventaSeleccionada} onClose={() => setVentaSeleccionada(null)} />
    </div>
  );
}
