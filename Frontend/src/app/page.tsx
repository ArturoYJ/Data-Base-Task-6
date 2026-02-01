import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">📚 Sistema de Biblioteca</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta 1 */}
        <Link href="/reports/1" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-blue-800">📖 Libros Populares</h2>
          <p className="text-gray-600 mt-2">Ver qué libros se piden más.</p>
        </Link>

        {/* Tarjeta 4 */}
        <Link href="/reports/4" className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
          <h2 className="text-xl font-bold text-blue-800">⏳ Control de Préstamos</h2>
          <p className="text-gray-600 mt-2">Monitoreo de libros pendientes y retrasos.</p>
        </Link>
        
        {/* Agrega aquí los Links a reportes 2, 3 y 5 siguiendo el mismo modelo */}
      </div>
    </div>
  );
}