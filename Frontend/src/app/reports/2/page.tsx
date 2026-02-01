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
    <div className="py-12 px-6">
      <Link href="/" className="text-blue-600 hover:underline text-sm">← Volver al Dashboard</Link>
      
      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold text-slate-800">Ranking de Lectores</h1>
        <p className="text-slate-500 text-sm mt-1">Análisis de comportamiento de usuarios</p>
      </header>

      <form className="mb-6 flex gap-3 items-end">
        <div>
          <label className="block text-sm text-slate-600 mb-1">Categoría</label>
          <select 
            name="categoria" 
            defaultValue={searchParams.categoria || 'Todos'}
            className="block w-44 px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todos">Todos</option>
            <option value="Lector Frecuente">Lector Frecuente</option>
            <option value="Lector Casual">Lector Casual</option>
            <option value="Lector Moroso">Lector Moroso</option>
          </select>
        </div>
        <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Aplicar
        </button>
      </form>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Usuario</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Email</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Libros Pedidos</th>
              <th className="px-4 py-3 text-center font-medium text-slate-600">Días Retraso</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Categoría</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {usuarios?.map((u: any, i: number) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{u.nombre}</td>
                <td className="px-4 py-3 text-slate-500">{u.email}</td>
                <td className="px-4 py-3 text-center text-slate-800">{u.libros_pedidos}</td>
                <td className="px-4 py-3 text-center text-red-600">{u.dias_retraso_total}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs rounded ${
                    u.categoria_lector === 'Lector Moroso' 
                      ? 'bg-red-50 text-red-700' 
                      : u.categoria_lector === 'Lector Frecuente'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
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