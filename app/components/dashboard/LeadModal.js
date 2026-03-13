export default function LeadModal({ lead, onClose, getBadgeColor, onUpdateEstado }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-[#40269A]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 lg:p-10">
      {/* Reducimos el borde superior en móvil (border-t-4) */}
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn border-t-4 md:border-t-8 border-[#FF0188]">
        {/* Ajustamos el botón de cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 bg-gray-100 hover:bg-[#FFDAED] hover:text-[#FF0188] text-gray-500 rounded-full flex items-center justify-center font-black transition-colors z-10"
        >
          ✕
        </button>

        <div className="bg-[#fcfaff] p-6 pt-12 md:p-10 border-b border-gray-100">
          {/* MAGIA RESPONSIVA: flex-col en móvil, flex-row en md */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 text-center md:text-left">
            {/* Círculo adaptado al móvil */}
            <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full bg-[#FFDAED] text-[#FF0188] flex items-center justify-center text-3xl md:text-4xl font-black shadow-inner">
              {(lead.nombre || "L").charAt(0).toUpperCase()}
              {(lead.apellidos || "").charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col items-center md:items-start w-full">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#40269A] leading-tight">
                {lead.nombre} {lead.apellidos}
              </h2>

              {/* flex-wrap para que las etiquetas no se rompan */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 mt-3 items-center">
                <span className="text-gray-500 font-bold tracking-wide bg-gray-100 px-3 py-1 rounded-full text-xs whitespace-nowrap">
                  Entró el{" "}
                  {new Date(lead.fecha || lead.createdAt)
                    .toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    .replace(/\//g, "-")}
                </span>

                {/* Ocultamos el puntito separador en móviles porque salta de línea */}
                <span className="hidden md:block w-1.5 h-1.5 bg-gray-300 rounded-full"></span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeColor(
                    lead.estado
                  )} whitespace-nowrap`}
                >
                  Estado: {lead.estado}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="space-y-6">
            <h3 className="text-base md:text-lg font-black text-[#FF0188] uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Información de Contacto
            </h3>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Email
              </label>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                {/* Añadido break-all por si el email es gigantesco */}
                <a
                  href={`mailto:${lead.email}`}
                  className="text-base md:text-lg font-bold text-[#40269A] hover:text-[#FF0188] hover:underline decoration-2 underline-offset-4 transition-all break-all"
                >
                  {lead.email}
                </a>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(lead.email);
                  }}
                  className="p-1.5 text-gray-400 hover:text-[#FF0188] hover:bg-[#FFDAED] rounded-md transition-all group shrink-0"
                  title="Copiar email"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Teléfono
              </label>
              <p className="text-[#40269A] font-medium text-base md:text-lg mt-1">
                {lead.telefono || "No proporcionado"}
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-base md:text-lg font-black text-[#FF0188] uppercase tracking-widest border-b-2 border-gray-50 pb-2">
              Oportunidad de Venta
            </h3>
            <div className="bg-[#FFDAED]/30 p-5 rounded-xl border border-[#FFDAED]">
              <label className="text-xs font-bold text-[#FF0188] uppercase tracking-wide block text-center md:text-left">
                Cursos en los que está interesado ({lead.cursos.length})
              </label>
              {/* flex-wrap centrado en móvil */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                {lead.cursos.map((curso, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-[#40269A] font-black px-4 py-2 rounded-lg border border-[#DEC7FF] text-xs md:text-sm shadow-sm text-center"
                  >
                    {curso}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER DE BOTONES ADAPTADO A MÓVIL (w-full para ocupar todo el ancho) */}
        <div className="bg-gray-50 p-4 md:p-6 lg:px-10 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
          <a
            href={`mailto:${lead.email}`}
            className="sm:mr-auto flex items-center justify-center gap-2 text-white bg-[#40269A] px-6 py-3 rounded-xl font-bold hover:bg-[#2c1a6b] transition-colors shadow-md w-full sm:w-auto text-sm md:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Escribir Email
          </a>

          {lead.estado === "Nuevo" && (
            <button
              onClick={() => {
                onUpdateEstado(lead.id, "Contactado");
                onClose();
              }}
              className="text-[#40269A] border-2 border-[#DEC7FF] bg-white px-6 py-3 rounded-xl font-bold hover:bg-[#DEC7FF]/30 transition-colors w-full sm:w-auto text-sm md:text-base"
            >
              Marcar como Contactado
            </button>
          )}

          {lead.estado === "Contactado" && (
            <button
              onClick={() => {
                onUpdateEstado(lead.id, "Nuevo");
                onClose();
              }}
              className="text-gray-500 border-2 border-gray-200 bg-white px-6 py-3 rounded-xl font-bold hover:bg-gray-100 hover:text-gray-700 transition-colors w-full sm:w-auto text-sm md:text-base"
            >
              Desmarcar Contactado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
