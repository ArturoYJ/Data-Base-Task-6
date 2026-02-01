import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">Sistema de Biblioteca</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Reporte 1 */}
        <Link href="/reports/1" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-blue-800">Libros Populares</h2>
          <p className="text-gray-600 mt-2">Ranking de libros más solicitados con clasificación de popularidad.</p>
        </Link>

        {/* Reporte 2 */}
        <Link href="/reports/2" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-blue-800">Ranking de Lectores</h2>
          <p className="text-gray-600 mt-2">Análisis de comportamiento de usuarios (Frecuentes vs Morosos).</p>
        </Link>

        {/* Reporte 3 */}
        <Link href="/reports/3" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-blue-800">Análisis de Géneros</h2>
          <p className="text-gray-600 mt-2">Participación de mercado por género literario (Window Functions).</p>
        </Link>

        {/* Reporte 4 */}
        <Link href="/reports/4" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-blue-800">Control de Préstamos</h2>
          <p className="text-gray-600 mt-2">KPIs de préstamos activos y cálculo de días transcurridos.</p>
        </Link>

        {/* Reporte 5 */}
        <Link href="/reports/5" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-blue-800">Rendimiento Autores</h2>
          <p className="text-gray-600 mt-2">Métricas de rotación de stock por autor y nacionalidad.</p>
        </Link>
      </div>
    </div>
  );
}