'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
import { Product } from '../../types/product';
import ProductModal from './ProductModal';
import OrdersTable from './OrdersTable';

export default function AdminDashboard() {
  const { user, userData, loading: authLoading, getToken } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  useEffect(() => {
    const init = async () => {
      if (authLoading) return;
      
      // Si no hay usuario o si el usuario NO es admin, lo sacamos
      if (!user || userData?.role !== 'ADMIN') {
        router.push('/');
        return;
      }

      if (activeTab === 'products') {
        await fetchProducts();
      }
    };
    init();
  }, [user, userData, authLoading, router, activeTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) fetchProducts();
      else alert('Error al eliminar');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (authLoading || (loading && activeTab === 'products')) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <div>
          <h1 className='text-4xl font-black tracking-tighter text-foreground'>
            ADMIN <span className='text-primary italic'>PANEL</span>
          </h1>
          <p className='text-muted'>
            Gestión de inventario y pedidos de Elite Padel.
          </p>
        </div>

        {activeTab === 'products' && (
          <button
            className='bg-primary text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all uppercase tracking-widest text-xs'
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={18} />
            Nuevo Producto
          </button>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className='flex gap-4 border-b border-border'>
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-foreground'}`}
        >
          Productos
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-foreground'}`}
        >
          Pedidos
        </button>
      </div>

      {/* Stats Bar (Opcional pero queda muy pro) */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {[
          { label: 'Total Productos', value: products.length },
          { label: 'En Stock', value: products.length }, // Podríamos sumar stock real
          { label: 'Categorías', value: 3 },
          { label: 'Ventas Hoy', value: 0 },
        ].map((stat, i) => (
          <div key={i} className='bg-card border border-border p-4 rounded-2xl'>
            <p className='text-xs text-muted font-bold uppercase tracking-widest'>
              {stat.label}
            </p>
            <p className='text-2xl font-black text-foreground'>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      {activeTab === 'products' ? (
        <div className='bg-card border border-border rounded-3xl overflow-hidden shadow-xl'>
          {/* Search & Actions */}
          <div className='p-6 border-b border-border flex items-center gap-4 bg-muted/5'>
            <div className='relative flex-1'>
              <Search
                className='absolute left-3 top-1/2 -translate-y-1/2 text-muted'
                size={18}
              />
              <input
                type='text'
                placeholder='Buscar producto o marca...'
                className='w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 outline-none focus:border-primary transition-all text-sm'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-muted/10 text-muted uppercase text-[10px] font-black tracking-widest'>
                  <th className='px-6 py-4'>Producto</th>
                  <th className='px-6 py-4'>Categoría</th>
                  <th className='px-6 py-4'>Precio</th>
                  <th className='px-6 py-4 text-center'>Acciones</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-border'>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className='hover:bg-muted/5 transition-colors group'
                  >
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 bg-muted/20 rounded-lg overflow-hidden flex-shrink-0'>
                          {product.variants?.[0]?.imageUrl ? (
                            <img
                              src={product.variants[0].imageUrl}
                              alt={product.name}
                              className='w-full h-full object-cover'
                            />
                          ) : (
                            <div className='w-full h-full flex items-center justify-center text-xs text-muted italic'>
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <p className='font-bold text-foreground text-sm leading-tight'>
                            {product.name}
                          </p>
                          <p className='text-xs text-muted'>{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='text-[10px] font-black bg-muted/20 px-2 py-1 rounded text-muted'>
                        {product.category}
                      </span>
                    </td>
                    <td className='px-6 py-4 font-bold text-primary'>
                      ${product.variants?.[0]?.price?.toLocaleString() || '0'}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          className='p-2 hover:bg-blue-500/10 hover:text-blue-500 rounded-lg transition-all text-muted'
                          title='Editar'
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className='p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-muted'
                          title='Eliminar'
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          className='p-2 hover:bg-primary/10 hover:text-primary rounded-lg transition-all text-muted'
                          title='Ver en tienda'
                          onClick={() => router.push(`/catalog/${product.id}`)}
                        >
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className='py-20 text-center space-y-2'>
                <p className='text-muted italic'>No se encontraron productos.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <OrdersTable getToken={getToken} />
      )}

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchProducts}
        product={editingProduct}
        getToken={getToken}
      />
    </div>
  );
}
