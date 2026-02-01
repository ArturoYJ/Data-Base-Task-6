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
    <div className="p-10 bg-gray-50 min-h-screen font-sans">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-blue-900 mb-6">✍️ Rendimiento de Autores</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nacionalidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Veces Prestado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rotación</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {autores?.map((a: any, i: number) => (
              <tr key={i}>
                <td className="px-6 py-4 font-bold">{a.nombre}</td>
                <td className="px-6 py-4 text-gray-500">{a.nacionalidad}</td>
                <td className="px-6 py-4 text-center">{a.stock_total}</td>
                <td className="px-6 py-4 text-center">{a.veces_prestado}</td>
                <td className="px-6 py-4 text-center font-mono text-blue-600">{a.rotacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4">
        {page > 1 && (
          <Link href={`/reports/5?page=${page - 1}`} className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-50">
            Anterior
          </Link>
        )}
        <span className="px-4 py-2 text-gray-600">Página {page} de {totalPages}</span>
        {page < (totalPages || 1) && (
          <Link href={`/reports/5?page=${page + 1}`} className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-50">
            Siguiente
          </Link>
        )}
      </div>
    </div>
  );
}