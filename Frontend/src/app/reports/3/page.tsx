import Link from 'next/link';
import { getRankingGeneros } from '@/lib/actions/report';
import { RankingGenero } from '@/lib/types/reports';

export const dynamic = 'force-dynamic';

export default async function Report3Page() {
  const result = await getRankingGeneros();
  const generos = result.data;
  const error = result.success === false ? result.error : null;
  const topGenero = generos && generos.length > 0 ? generos[0].genero : 'N/A';

  return (
    <div className="py-12 px-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Volver al Dashboard</Link>
      
      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Análisis de Géneros</h1>
        <p className="text-slate-500 text-sm mt-1">Participación de mercado por género literario</p>
      </header>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error: {error}
        </div>
      )}

      {!generos && !error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
          Cargando datos o no hay géneros disponibles...
        </div>
      )}

      <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200">
        <p className="text-slate-500 text-sm">Género más popular</p>
        <p className="text-2xl font-semibold text-slate-800">{topGenero}</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-center font-medium text-slate-600 w-20">Ranking</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Género</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Préstamos</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Participación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {generos?.map((g: RankingGenero, i: number) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-center font-medium text-slate-400">#{g.ranking}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{g.genero}</td>
                <td className="px-4 py-3 text-center text-slate-800">{g.total_prestamos}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-32">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${g.porcentaje_del_total}%` }}
                      />
                    </div>
                    <span className="text-slate-600 text-xs w-12">{g.porcentaje_del_total}%</span>
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