import ExportButton from "../views/ExportButton";

// Archivo: components/dashboard/AlumnosView.js
export default function AlumnosView({
  busqueda,
  setBusqueda,
  alumnosProcesados,
  manejarOrden,
  FlechaOrden,
  setAlumnoSeleccionado,
  getBadgeColor,
  filtroEmpresa,
  setFiltroEmpresa,
  empresasUnicas,
  onExportar,
}) {
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <p className="text-gray-500 font-medium">
          Usuarios registrados en la plataforma con perfil completo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ExportButton onExportar={onExportar} />
          <select
            value={filtroEmpresa}
            onChange={(e) => setFiltroEmpresa(e.target.value)}
            // Cambiamos sm:w-64 por sm:w-48 (más estrecho) o sm:w-1/4
            className="sm:w-58 px-5 py-3 rounded-xl border-2 border-[#DEC7FF] bg-white text-[#40269A] font-bold focus:border-[#40269A] focus:ring-4 focus:ring-[#DEC7FF]/50 outline-none transition-all cursor-pointer appearance-none shadow-sm shrink-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2340269A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em 1.2em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">Todas las empresas</option>
            {empresasUnicas.map((empresa, idx) => (
              <option key={idx} value={empresa}>
                {empresa}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            // Mantenemos flex-1 y añadimos w-full por si acaso
            className="flex-1 min-w-72 px-5 py-3 rounded-xl border-2 border-gray-100 focus:border-[#FF0188] focus:ring-4 focus:ring-[#FFDAED] outline-none transition-all font-medium text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
          <thead>
            <tr className="bg-[#fcfaff] text-[#40269A] border-b border-gray-200 select-none">
              <th
                onClick={() => manejarOrden("usuario")}
                className="p-4 font-black text-sm uppercase w-[30%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Usuario / Email <FlechaOrden columna="usuario" />
              </th>
              <th
                onClick={() => manejarOrden("nombre")}
                className="p-4 font-black text-sm uppercase w-[25%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Nombre Real <FlechaOrden columna="nombre" />
              </th>
              <th
                onClick={() => manejarOrden("perfil")}
                className="p-4 font-black text-sm uppercase w-[20%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors"
              >
                Perfil <FlechaOrden columna="perfil" />
              </th>
              <th
                onClick={() => manejarOrden("activo")}
                className="p-4 font-black text-sm uppercase w-[10%] cursor-pointer hover:bg-[#DEC7FF]/20 group transition-colors text-center"
              >
                Activo <FlechaOrden columna="activo" />
              </th>
              <th className="p-4 font-black text-sm uppercase w-[15%] text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {alumnosProcesados.length > 0 ? (
              alumnosProcesados.map((alumno) => (
                <tr
                  key={alumno.id}
                  className="border-b border-gray-100 hover:bg-[#fcfaff] transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-[#40269A] truncate">@{alumno.username}</div>
                    <div className="text-xs text-gray-400 truncate">{alumno.email}</div>
                  </td>
                  <td className="p-4 text-gray-600 font-medium truncate">
                    {alumno.nombre} {alumno.apellidos}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(alumno.perfil)}`}
                    >
                      {alumno.perfil}
                    </span>
                    <div className="text-xs text-gray-400 mt-1 truncate">{alumno.profesion}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <div
                        className={`w-3 h-3 rounded-full ${alumno.activo ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setAlumnoSeleccionado(alumno)}
                      className="text-[#40269A] bg-[#DEC7FF]/30 hover:bg-[#C49DFF] hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
                    >
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-400 font-medium">
                  No se ha encontrado ningún alumno.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
