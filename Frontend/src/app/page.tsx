import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-12 px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-800 text-center">Sistema de Biblioteca</h1>
        <p className="text-slate-500 mt-2 text-center">Panel de reportes y métricas</p>
      </header>

      <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">Tecnologías SQL utilizadas en este proyecto</h3>
        <p className="text-sm text-blue-700 mb-3">
          Este sistema demuestra el uso de estructuras avanzadas de PostgreSQL para generar reportes analíticos a partir de un modelo relacional de biblioteca.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Views', 'GROUP BY / HAVING', 'Window Functions', 'CTEs (WITH)', 'CASE Expressions', 'Subqueries', 'Validación Zod + SQL Constraints'].map((tag) => (
            <span key={tag} className="inline-block px-2.5 py-1 text-xs font-medium bg-white text-blue-700 rounded-full border border-blue-200">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link href="/reports/1" className="group block p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <h2 className="text-lg font-medium text-slate-700 group-hover:text-blue-600">Libros Populares</h2>
          <p className="text-slate-500 text-sm mt-1">Ranking de libros más solicitados</p>
        </Link>

        <Link href="/reports/2" className="group block p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <h2 className="text-lg font-medium text-slate-700 group-hover:text-blue-600">Ranking de Lectores</h2>
          <p className="text-slate-500 text-sm mt-1">Comportamiento de usuarios</p>
        </Link>

        <Link href="/reports/3" className="group block p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <h2 className="text-lg font-medium text-slate-700 group-hover:text-blue-600">Análisis de Géneros</h2>
          <p className="text-slate-500 text-sm mt-1">Participación por género literario</p>
        </Link>

        <Link href="/reports/4" className="group block p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <h2 className="text-lg font-medium text-slate-700 group-hover:text-blue-600">Control de Préstamos</h2>
          <p className="text-slate-500 text-sm mt-1">KPIs de préstamos activos</p>
        </Link>

        <Link href="/reports/5" className="group block p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <h2 className="text-lg font-medium text-slate-700 group-hover:text-blue-600">Rendimiento Autores</h2>
          <p className="text-slate-500 text-sm mt-1">Métricas de rotación por autor</p>
        </Link>

        <Link href="/reports/6" className="group block p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all">
          <h2 className="text-lg font-medium text-slate-700 group-hover:text-blue-600">Inventario Disponibilidad</h2>
          <p className="text-slate-500 text-sm mt-1">Stock y disponibilidad por libro</p>
        </Link>
      </div>

      <footer className="mt-14 flex flex-col items-center text-center">
        <img 
          src="/godzilla.png" 
          alt="Godzilla leyendo en la biblioteca" 
          className="w-40 h-40 rounded-full object-cover border-2 border-slate-200 shadow-sm mb-4"
        />
        <p className="text-sm italic text-slate-400 max-w-md">
          "Si una consulta SQL se ejecuta en una base de datos y nadie la observa... ¿realmente devolvió resultados?" 
          <span className="block mt-1 text-xs not-italic text-slate-300">-Arturo Yion Jaime, 2006-2025</span>
        </p>
      </footer>
    </div>
  );
}