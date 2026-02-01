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
    <div className="py-12 px-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Volver al Dashboard</Link>
      
      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Libros Populares</h1>
        <p className="text-slate-500 text-sm mt-1">Ranking de libros más solicitados</p>
      </header>

      <form className="mb-6 flex gap-3 items-end">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Filtrar por popularidad</label>
          <select 
            name="popularidad" 
            defaultValue={searchParams.popularidad || 'Todos'}
            className="block w-44 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos</option>
            <option value="Muy Popular">Muy Popular</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Filtrar
        </button>
      </form>

      <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200">
        <p className="text-slate-500 text-sm">Total de libros</p>
        <p className="text-2xl font-semibold text-slate-800">{libros?.length || 0}</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Título</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Autor</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Género</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Préstamos</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {libros?.map((libro: any, index: number) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{libro.titulo}</td>
                <td className="px-4 py-3 text-slate-600">{libro.autor}</td>
                <td className="px-4 py-3 text-slate-600">{libro.genero}</td>
                <td className="px-4 py-3 text-center text-slate-800">{libro.total_prestamos}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    libro.popularidad === 'Muy Popular' 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-slate-100 text-slate-600'
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