import Link from 'next/link';

export default function Home() {
  return (
    <div className="py-12 px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold text-slate-800">Sistema de Biblioteca</h1>
        <p className="text-slate-500 mt-2">Panel de reportes y métricas</p>
      </header>
      
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
      </div>
    </div>
  );
}