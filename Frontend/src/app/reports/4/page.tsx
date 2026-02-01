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
    <div className="p-10 bg-gray-50 min-h-screen font-sans">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-blue-900 mb-6">⏳ Control de Préstamos Activos</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Préstamo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días Transcurridos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prestamos?.map((p: any, i: number) => (
              <tr key={i}>
                <td className="px-6 py-4 font-medium">{p.titulo}</td>
                <td className="px-6 py-4">{p.usuario}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(p.fecha_prestamo).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-bold text-center">{p.dias_transcurridos}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    p.estado === 'retrasado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {p.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4">
        {page > 1 && (
          <Link href={`/reports/4?page=${page - 1}`} className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-50">
            Anterior
          </Link>
        )}
        <span className="px-4 py-2 text-gray-600">Página {page} de {totalPages}</span>
        {page < (totalPages || 1) && (
          <Link href={`/reports/4?page=${page + 1}`} className="px-4 py-2 bg-white border rounded shadow hover:bg-gray-50">
            Siguiente
          </Link>
        )}
      </div>
    </div>
  );
}