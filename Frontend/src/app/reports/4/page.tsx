import Link from 'next/link';
import { getPrestamos } from '@/lib/actions/report';

export default async function Report4Page({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { data: prestamos, totalPages } = await getPrestamos(page);

  return (
    <div className="py-12 px-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Volver al Dashboard</Link>
      
      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Control de Préstamos</h1>
        <p className="text-slate-500 text-sm mt-1">KPIs de préstamos activos</p>
      </header>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Libro</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Usuario</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Fecha Préstamo</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Días</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {prestamos?.map((p: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{p.titulo}</td>
                <td className="px-4 py-3 text-slate-600">{p.usuario}</td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {new Date(p.fecha_prestamo).toLocaleDateString('es-MX')}
                </td>
                <td className="px-4 py-3 text-center font-mono text-slate-800">{p.dias_transcurridos}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    p.estado === 'retrasado' 
                      ? 'bg-red-50 text-red-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-2">
        {page > 1 && (
          <Link 
            href={`/reports/4?page=${page - 1}`} 
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
            href={`/reports/4?page=${page + 1}`} 
            className="px-3 py-1.5 text-sm border border-slate-300 rounded hover:bg-slate-50"
          >
            Siguiente
          </Link>
        )}
      </div>
    </div>
  );
}