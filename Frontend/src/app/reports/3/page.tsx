import Link from 'next/link';
import { getRankingGeneros } from '@/lib/actions/report';

export default async function Report3Page() {
  const { data: generos } = await getRankingGeneros();
  // KPI: Genero Top 1
  const topGenero = generos && generos.length > 0 ? generos[0].genero : 'N/A';

  return (
    <div className="p-10 bg-gray-50 min-h-screen font-sans">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-blue-900 mb-6">📊 Análisis de Géneros</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
          <p className="text-gray-500">Género Más Popular</p>
          <p className="text-3xl font-bold">{topGenero}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ranking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Género</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Préstamos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participación (%)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {generos?.map((g: any, i: number) => (
              <tr key={i}>
                <td className="px-6 py-4 font-bold text-gray-700">#{g.ranking}</td>
                <td className="px-6 py-4">{g.genero}</td>
                <td className="px-6 py-4">{g.total_prestamos}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="mr-2">{g.porcentaje_del_total}%</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${g.porcentaje_del_total}%` }}></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}