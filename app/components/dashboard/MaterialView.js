import ExportButton from "../views/ExportButton";

export default function MaterialView({
  busqueda,
  setBusqueda,
  materialesProcesados,
  manejarOrden,
  FlechaOrden,
  setMaterialSeleccionado,
  filtroCategoria,
  setFiltroCategoria,
  categoriasUnicas,
  onExportar,
}) {
  return (
    <div className="animate-fadeIn">
      {/* CABECERA Y BUSCADOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <p className="text-gray-500 font-medium">
          Registro histórico de venta de materiales, plantillas y recursos.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full md:w-auto">
          {/* BOTÓN EXPORTAR */}
          <ExportButton onExportar={onExportar} />
          {/* FILTRO DE CATEGORÍAS */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="sm:w-56 px-4 py-3 rounded-xl border-2 border-[#DEC7FF] bg-white text-[#40269A] font-bold focus:border-[#40269A] focus:ring-4 focus:ring-[#DEC7FF]/50 outline-none transition-all cursor-pointer appearance-none shadow-sm shrink-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2340269A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "1.2em 1.2em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">Todas las categorías</option>
            {categoriasUnicas?.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* BUSCADOR DE TEXTO */}
          <input
            type="text"
            placeholder="Buscar material o alumno..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 min-w-72 px-4 py-3 border-2 border-gray-100 rounded-xl bg-[#fcfaff] text-[#40269A] font-bold focus:outline-none focus:border-[#FF0188] focus:ring-4 focus:ring-[#FFDAED] transition-all"
          />
        </div>
      </div>

      {/* TABLA DE MATERIALES */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
          <thead>
            <tr className="bg-[#fcfaff] text-[#40269A] border-b border-gray-200 select-none">
              <th
                onClick={() => manejarOrden("fechaCompra")}
                className="p-4 font-black text-sm uppercase w-[15%] cursor-pointer hover:bg-[#DEC7FF]/20 transition-colors"
              >
                Fecha <FlechaOrden columna="fechaCompra" />
              </th>
              <th
                onClick={() => manejarOrden("alumnoNombre")}
                className="p-4 font-black text-sm uppercase w-[25%] cursor-pointer hover:bg-[#DEC7FF]/20 transition-colors"
              >
                Alumno <FlechaOrden columna="alumnoNombre" />
              </th>
              <th
                onClick={() => manejarOrden("nombreMaterial")}
                className="p-4 font-black text-sm uppercase w-[30%] cursor-pointer hover:bg-[#DEC7FF]/20 transition-colors"
              >
                Material <FlechaOrden columna="nombreMaterial" />
              </th>
              <th
                onClick={() => manejarOrden("categoria")}
                className="p-4 font-black text-sm uppercase w-[15%] cursor-pointer hover:bg-[#DEC7FF]/20 transition-colors"
              >
                Categoría <FlechaOrden columna="categoria" />
              </th>
              <th
                onClick={() => manejarOrden("precio")}
                className="p-4 font-black text-sm uppercase w-[10%] cursor-pointer hover:bg-[#DEC7FF]/20 transition-colors"
              >
                Precio <FlechaOrden columna="precio" />
              </th>
              <th className="p-4 font-black text-sm uppercase w-[10%] text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {materialesProcesados.length > 0 ? (
              materialesProcesados.map((item) => (
                <tr
                  key={item._id || item.id}
                  className="border-b border-gray-100 hover:bg-[#fcfaff] transition-colors"
                >
                  <td className="p-4 text-gray-500 font-medium">
                    {item.fechaCompraStr || item.fechaCompra}
                  </td>
                  {/* Nota: Asumimos que al traerlo de la BD haces un .populate("alumno") y extraes el nombre */}
                  <td className="p-4 font-bold text-[#40269A] truncate">
                    {item.alumnoNombre || "Desconocido"}
                  </td>
                  <td className="p-4 text-gray-700 truncate font-medium">{item.nombreMaterial}</td>
                  <td className="p-4">
                    <span className="bg-purple-50 text-[#40269A] px-3 py-1 rounded-full text-xs font-bold border border-purple-100">
                      {item.categoria}
                    </span>
                  </td>
                  <td className="p-4 font-black text-[#FF0188]">{item.precio}€</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setMaterialSeleccionado(item)}
                      className="text-[#40269A] bg-[#DEC7FF]/30 hover:bg-[#C49DFF] hover:text-white px-4 py-2 rounded-xl font-bold text-xs transition-all"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-12 text-center text-gray-400 font-medium">
                  No se ha encontrado ningún material que coincida con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
