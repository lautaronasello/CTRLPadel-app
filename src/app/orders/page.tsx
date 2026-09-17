'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  name: string;
  imageUrl?: string;
}

interface ProductVariant {
  imageUrl?: string;
  product: Product;
}

interface OrderItem {
  id: string;
  quantity: number;
  variant: ProductVariant;
}

interface Order {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, getToken, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (authLoading) return;

      if (!user) {
        setLoading(false);
        return;
      }

      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [user, getToken, authLoading]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-primary text-black font-black';
      case 'PENDING':
        return 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-yellow-500/20 dark:text-yellow-500 dark:border-yellow-500/30';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/20 dark:text-red-500 dark:border-red-500/30';
      default:
        return 'bg-zinc-800 text-zinc-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'PAGADO';
      case 'PENDING':
        return 'PENDIENTE';
      case 'CANCELLED':
        return 'CANCELADO';
      default:
        return status;
    }
  };

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    );

  if (!user)
    return (
      <div className='min-h-screen flex items-center justify-center p-6 text-center'>
        <div className='glass p-12 rounded-[2.5rem] max-w-md'>
          <h2 className='text-3xl font-black text-foreground mb-4 uppercase'>
            Iniciá sesión
          </h2>
          <p className='text-muted'>
            Debes estar conectado para ver tus pedidos.
          </p>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='space-y-12'
      >
        <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
          <div>
            <h1 className='text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.8]'>
              Mis <span className='text-primary italic'>Pedidos</span>
            </h1>
            <p className='text-muted mt-4 font-medium uppercase tracking-widest text-sm'>
              Historial de compras de {user.displayName || 'tu cuenta'}
            </p>
          </div>
          <div className='glass px-6 py-3 rounded-2xl border-border'>
            <span className='text-muted text-xs font-bold uppercase tracking-widest'>
              Total pedidos:
            </span>
            <span className='ml-3 text-xl font-black text-foreground'>
              {orders.length}
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className='glass p-20 rounded-[3rem] text-center space-y-6 border-dashed border-border'>
            <div className='text-6xl opacity-20'>📦</div>
            <p className='text-muted font-bold uppercase tracking-widest'>
              Aún no realizaste ninguna compra
            </p>
            <button className='bg-foreground text-background px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform'>
              Ir al catálogo
            </button>
          </div>
        ) : (
          <div className='grid gap-6'>
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className='glass p-8 rounded-4xl border-border hover:border-primary/30 transition-all group'
              >
                <div className='flex flex-col lg:flex-row gap-8'>
                  {/* Info de la Orden */}
                  <div className='flex-1 space-y-6'>
                    <div className='flex items-center justify-between'>
                      <div className='space-y-1'>
                        <span className='text-muted text-[10px] font-black uppercase tracking-[0.2em]'>
                          Orden ID
                        </span>
                        <p className='text-foreground font-mono text-xs opacity-50'>
                          {order.id}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest shadow-lg font-bold ${getStatusStyle(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      {order.items.map((item: OrderItem) => (
                        <div
                          key={item.id}
                          className='flex items-center gap-4 bg-background/50 p-3 rounded-2xl border border-border'
                        >
                          <div className='w-12 h-12 relative rounded-lg overflow-hidden border border-border'>
                            <Image
                              src={
                                item.variant.product.imageUrl ||
                                item.variant.imageUrl ||
                                '/next.svg'
                              }
                              alt='Product'
                              fill
                              className='object-contain'
                            />
                          </div>
                          <div>
                            <p className='text-foreground text-xs font-bold line-clamp-1'>
                              {item.variant.product.name}
                            </p>
                            <p className='text-muted text-[10px] uppercase font-black'>
                              Cant: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total y Acción */}
                  <div className='lg:w-48 lg:border-l border-border lg:pl-8 flex lg:flex-col justify-between items-center lg:items-start gap-4'>
                    <div className='space-y-1'>
                      <span className='text-muted text-[10px] font-black uppercase tracking-[0.2em]'>
                        Total
                      </span>
                      <p className='text-3xl font-black text-primary tracking-tighter'>
                        ${order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className='bg-[#113360] text-white! w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1a4a8a] hover:shadow-[0_0_20px_rgba(17,51,96,0.4)] transition-all flex items-center justify-center'
                    >
                      Detalles
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
