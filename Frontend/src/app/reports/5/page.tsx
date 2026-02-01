import Link from 'next/link';
import { getAutoresMetricas } from '@/lib/actions/report';

export default async function Report5Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { data: autores, totalPages } = await getAutoresMetricas(page);

  return (
    <div className="py-12 px-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Volver al Dashboard</Link>
      
      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Rendimiento de Autores</h1>
        <p className="text-slate-500 text-sm mt-1">Métricas de rotación de stock por autor</p>
      </header>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Autor</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Nacionalidad</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Stock</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Préstamos</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Rotación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {autores?.map((a: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{a.nombre}</td>
                <td className="px-4 py-3 text-slate-500">{a.nacionalidad}</td>
                <td className="px-4 py-3 text-center text-slate-800">{a.stock_total}</td>
                <td className="px-4 py-3 text-center text-slate-800">{a.veces_prestado}</td>
                <td className="px-4 py-3 text-center font-mono text-blue-600">{a.rotacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2">
        {page > 1 && (
          <Link 
            href={`/reports/5?page=${page - 1}`} 
            className="px-3 py-1.5 text-sm border border-slate-300 rounded hover:bg-slate-50"
          >
            Anterior
          </Link>
        )}
        <span className="px-3 py-1.5 text-sm text-slate-500">
          Página {page} de {totalPages || 1}
        </span>
        {page < (totalPages || 1) && (
          <Link 
            href={`/reports/5?page=${page + 1}`} 
            className="px-3 py-1.5 text-sm border border-slate-300 rounded hover:bg-slate-50"
          >
            Siguiente
          </Link>
        )}
      </div>
    </div>
  );
}