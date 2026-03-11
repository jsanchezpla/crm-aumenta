export default function ExportarButton({ onExportar }) {
  return (
    <button
      onClick={onExportar}
      className="flex items-center justify-center gap-2 bg-[#107c41] hover:bg-[#0c5e31] text-white px-5 py-3 rounded-xl font-bold transition-all shadow-sm shrink-0 cursor-pointer"
      title="Exportar a Excel"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
      </svg>
      Exportar
    </button>
  );
}
