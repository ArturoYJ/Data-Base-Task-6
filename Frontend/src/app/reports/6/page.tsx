import Link from 'next/link';
import { getInventarioDisponibilidad } from '@/lib/actions/report';
import { InventarioDisponibilidad } from '@/lib/types/reports';

export default async function Report6Page({
  searchParams,
}: {
  searchParams: { estado?: string };
}) {
  const formData = new FormData();
  if (searchParams.estado) {
    formData.append('estado', searchParams.estado);
  }

  const { data: inventario } = await getInventarioDisponibilidad(formData);

  return (
    <div className="py-12 px-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Volver al Dashboard</Link>
      
      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Inventario y Disponibilidad</h1>
        <p className="text-slate-500 text-sm mt-1">Stock y disponibilidad en tiempo real por libro</p>
      </header>

      <form method="get" className="mb-6 flex gap-3 items-end">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Filtrar por estado</label>
          <select 
            name="estado" 
            defaultValue={searchParams.estado || 'Todos'}
            className="block w-44 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos</option>
            <option value="Disponible">Disponible</option>
            <option value="Stock Bajo">Stock Bajo</option>
            <option value="Agotado">Agotado</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Filtrar
        </button>
      </form>

      <div className="mb-6 bg-white p-4 rounded-lg border border-slate-200">
        <p className="text-slate-500 text-sm">Total de libros en inventario</p>
        <p className="text-2xl font-semibold text-slate-800">{inventario?.length || 0}</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Título</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Autor</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Género</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Stock</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Prestados</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Disponibles</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">% Disp.</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inventario?.map((item: InventarioDisponibilidad, index: number) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{item.titulo}</td>
                <td className="px-4 py-3 text-slate-600">{item.autor}</td>
                <td className="px-4 py-3 text-slate-600">{item.genero}</td>
                <td className="px-4 py-3 text-center text-slate-800">{item.stock_total}</td>
                <td className="px-4 py-3 text-center text-slate-800">{item.ejemplares_prestados}</td>
                <td className="px-4 py-3 text-center font-semibold text-slate-800">{item.disponibles}</td>
                <td className="px-4 py-3 text-center font-mono text-slate-600">{item.porcentaje_disponibilidad}%</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    item.estado_inventario === 'Disponible' 
                      ? 'bg-green-50 text-green-700'
                      : item.estado_inventario === 'Stock Bajo'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                  }`}>
                    {item.estado_inventario}
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
