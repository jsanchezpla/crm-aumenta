"use client";
const Sidebar = ({ vistaActiva, setVistaActiva, handleLogout }) => {
  const getMenuClass = (vista) => {
    const baseClass = "block p-4 rounded-2xl font-bold transition-all transform cursor-pointer ";
    if (vistaActiva === vista) {
      return (
        baseClass +
        "bg-[#FF0188] text-white shadow-lg shadow-pink-500/30 hover:scale-105 font-black"
      );
    }
    return baseClass + "text-[#C49DFF] hover:bg-[#C49DFF]/20 hover:text-[#40269A]";
  };

  return (
    <aside className="w-64 bg-[#40269A] text-white flex flex-col shadow-2xl z-10 shrink-0">
      <div className=" pt-8 pb-4 text-3xl font-black border-b border-[#C49DFF]/30 tracking-widest text-center font-playpen">
        CRM<span className="text-[#FF0188]">.</span>
        <a
          href="https://salamandrasolutions.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
        >
          <span className="text-[0.525rem] text-gray-400 font-bold uppercase tracking-widest group-hover:text-gray-500 transition-colors">
            Desarrollado por
          </span>
          <span className="text-[0.725rem] font-black text-gray-300 group-hover:text-[#FF0188] transition-colors duration-300">
            Salamandra Solutions
          </span>
        </a>
      </div>

      <nav className="flex-1 p-6 space-y-4 text-sm tracking-wide">
        <div
          onClick={() => setVistaActiva("estadisticas")}
          className={getMenuClass("estadisticas")}
        >
          Inicio
        </div>
        <div onClick={() => setVistaActiva("leads")} className={getMenuClass("leads")}>
          Leads
        </div>
        <div onClick={() => setVistaActiva("alumnos")} className={getMenuClass("alumnos")}>
          Clientes
        </div>
        <div onClick={() => setVistaActiva("ventas")} className={getMenuClass("ventas")}>
          Ventas cursos
        </div>
        <div onClick={() => setVistaActiva("materiales")} className={getMenuClass("materiales")}>
          Ventas material
        </div>
      </nav>
      <div className="p-6 border-t border-[#C49DFF]/30">
        <button
          onClick={handleLogout}
          className="w-full p-4 text-xs font-black text-[#C49DFF] hover:text-white border-2 border-[#C49DFF] hover:bg-[#C49DFF]/20 rounded-2xl transition-all tracking-widest"
        >
          CERRAR SESIÓN
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
