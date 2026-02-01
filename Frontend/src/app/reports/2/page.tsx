import Link from 'next/link';
import { getUsuariosStatus } from '@/lib/actions/report';

export default async function Report2Page({
  searchParams,
}: {
  searchParams: { categoria?: string };
}) {
  const formData = new FormData();
  if (searchParams.categoria) {
    formData.append('categoria', searchParams.categoria);
  }

  const { data: usuarios } = await getUsuariosStatus(formData);

  return (
    <div className="p-10 bg-gray-50 min-h-screen font-sans">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-blue-900 mb-6">👥 Ranking de Lectores</h1>

      <form className="mb-8 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Categoría:</label>
          <select 
            name="categoria" 
            defaultValue={searchParams.categoria || 'Todos'}
            className="mt-1 block w-48 p-2 border border-gray-300 rounded-md"
          >
            <option value="Todos">Todos</option>
            <option value="Lector Frecuente">Lector Frecuente</option>
            <option value="Lector Casual">Lector Casual</option>
            <option value="Lector Moroso">Lector Moroso</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Aplicar
        </button>
      </form>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Libros Pedidos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días de Retraso</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios?.map((u: any, i: number) => (
              <tr key={i}>
                <td className="px-6 py-4 font-medium">{u.nombre}</td>
                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                <td className="px-6 py-4">{u.libros_pedidos}</td>
                <td className="px-6 py-4 text-red-600">{u.dias_retraso_total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    u.categoria_lector === 'Lector Moroso' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {u.categoria_lector}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}