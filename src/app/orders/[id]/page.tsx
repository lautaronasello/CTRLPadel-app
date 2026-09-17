'use client';

import { use, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  name: string;
  imageUrl?: string;
}

interface ProductVariant {
  name: string;
  imageUrl?: string;
  product: Product;
}

interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  variant: ProductVariant;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
  shippingPhone: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getToken } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = await getToken();
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, getToken]);

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin' />
      </div>
    );
  if (!order)
    return (
      <div className='min-h-screen flex items-center justify-center text-white font-black uppercase tracking-widest'>
        Orden no encontrada
      </div>
    );

  return (
    <div className='min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-12'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
        <Link
          href='/orders'
          className='text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m15 18-6-6 6-6' />
          </svg>
          Volver
        </Link>
        <div className='flex items-center gap-4'>
          <span className='text-zinc-500 text-[10px] font-black uppercase tracking-widest'>
            Estado:
          </span>
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${order.status === 'PAID' ? 'bg-primary text-black' : 'bg-white/5 text-white border border-white/10'}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Info Principal */}
        <div className='lg:col-span-2 space-y-8'>
          <section className='glass p-10 rounded-[3rem] border-white/5 space-y-8'>
            <h2 className='text-2xl font-black text-white uppercase tracking-tighter italic'>
              Productos
            </h2>
            <div className='space-y-6'>
              {order.items.map((item: OrderItem) => (
                <div
                  key={item.id}
                  className='flex gap-6 items-center bg-white/2 p-4 rounded-4xl border border-white/5'
                >
                  <div className='w-24 h-24 relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/5'>
                    <Image
                      src={
                        item.variant.product.imageUrl ||
                        item.variant.imageUrl ||
                        '/next.svg'
                      }
                      alt={item.variant.product.name}
                      fill
                      className='object-contain p-2'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-white font-bold text-lg leading-tight uppercase'>
                      {item.variant.product.name}
                    </h3>
                    <p className='text-zinc-500 text-[10px] font-black uppercase tracking-widest'>
                      {item.variant.name}
                    </p>
                    <div className='mt-2 flex justify-between items-end'>
                      <p className='text-primary font-black text-xl'>
                        ${item.price.toLocaleString()}
                      </p>
                      <p className='text-zinc-500 text-xs font-bold uppercase'>
                        Cant: {item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Detalle */}
        <div className='space-y-8'>
          <section className='glass p-8 rounded-[2.5rem] border-white/5 space-y-6'>
            <h2 className='text-xl font-black text-white uppercase tracking-tighter italic'>
              Envío
            </h2>
            <div className='space-y-4'>
              <div className='space-y-1'>
                <p className='text-zinc-500 text-[10px] font-black uppercase tracking-widest'>
                  Dirección
                </p>
                <p className='text-white font-bold text-sm leading-relaxed'>
                  {order.shippingAddress || 'No especificada'}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-zinc-500 text-[10px] font-black uppercase tracking-widest'>
                  Ciudad / CP
                </p>
                <p className='text-white font-bold text-sm'>
                  {order.shippingCity}, {order.shippingZip}
                </p>
              </div>
              <div className='space-y-1'>
                <p className='text-zinc-500 text-[10px] font-black uppercase tracking-widest'>
                  Teléfono
                </p>
                <p className='text-white font-bold text-sm'>
                  {order.shippingPhone}
                </p>
              </div>
            </div>
          </section>

          <section className='glass p-8 rounded-[2.5rem] border-primary/20 bg-primary/5 space-y-6'>
            <h2 className='text-xl font-black text-primary uppercase tracking-tighter italic'>
              Resumen Pago
            </h2>
            <div className='space-y-4'>
              <div className='flex justify-between text-zinc-400 text-xs font-bold uppercase tracking-widest'>
                <span>Total Items</span>
                <span>${order.totalAmount.toLocaleString()}</span>
              </div>
              <div className='flex justify-between text-zinc-400 text-xs font-bold uppercase tracking-widest'>
                <span>Envío</span>
                <span className='text-primary underline'>Gratis</span>
              </div>
              <div className='pt-4 border-t border-white/10 flex justify-between items-end'>
                <span className='text-white font-black text-lg uppercase tracking-widest'>
                  Total
                </span>
                <span className='text-3xl font-black text-white tracking-tighter'>
                  ${order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
