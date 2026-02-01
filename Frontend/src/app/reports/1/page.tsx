import Link from 'next/link';
import { getLibrosPopulares } from '@/lib/actions/report';

export default async function Report1Page({
  searchParams,
}: {
  searchParams: { popularidad?: string };
}) {
  const formData = new FormData();
  if (searchParams.popularidad) {
    formData.append('popularidad', searchParams.popularidad);
  }

  const { data: libros } = await getLibrosPopulares(formData);

  return (
    <div className="p-10 bg-gray-50 min-h-screen font-sans">
      <Link href="/" className="text-blue-600 hover:underline mb-4 block">← Volver al Dashboard</Link>
      <h1 className="text-3xl font-bold text-blue-900 mb-6">📖 Libros Populares</h1>

      <form className="mb-8 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrar por Popularidad:</label>
          <select 
            name="popularidad" 
            defaultValue={searchParams.popularidad || 'Todos'}
            className="mt-1 block w-48 p-2 border border-gray-300 rounded-md"
          >
            <option value="Todos">Todos</option>
            <option value="Muy Popular">Muy Popular</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Filtrar
        </button>
      </form>

      <div className="mb-6 bg-white p-4 rounded shadow border-l-4 border-blue-500">
        <p className="text-gray-500">Total Libros Listados</p>
        <p className="text-2xl font-bold">{libros?.length || 0}</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Género</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Préstamos</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {libros?.map((libro: any, index: number) => (
              <tr key={index}>
                <td className="px-6 py-4">{libro.titulo}</td>
                <td className="px-6 py-4">{libro.autor}</td>
                <td className="px-6 py-4">{libro.genero}</td>
                <td className="px-6 py-4 text-center">{libro.total_prestamos}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    libro.popularidad === 'Muy Popular' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {libro.popularidad}
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