'use client';

import { use, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutStatusPage({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status } = use(params);
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === 'success') {
      clearCart();
    }
  }, [status, clearCart]);

  const config: any = {
    success: {
      icon: '✅',
      title: '¡PAGO EXITOSO!',
      subtitle: 'Tu pedido ya está siendo procesado.',
      color: 'text-primary',
      bg: 'bg-primary/10',
      description:
        'Recibirás un email con los detalles de tu compra y el seguimiento del envío.',
    },
    failure: {
      icon: '❌',
      title: 'PAGO RECHAZADO',
      subtitle: 'Hubo un problema con tu tarjeta.',
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      description:
        'No te preocupes, no se realizó ningún cargo. Podés intentar nuevamente con otro medio de pago.',
    },
    pending: {
      icon: '⏳',
      title: 'PAGO PENDIENTE',
      subtitle: 'Estamos esperando la confirmación.',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      description:
        'Tu pago está en proceso. Te avisaremos en cuanto Mercado Pago nos confirme la transacción.',
    },
  };

  const current = config[status] || config.pending;

  return (
    <div className='min-h-[80vh] flex items-center justify-center p-6'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='w-full max-w-lg glass p-12 rounded-[2.5rem] border-white/10 text-center space-y-8 shadow-2xl relative overflow-hidden'
      >
        {/* Glow effect */}
        <div
          className={`absolute -top-24 -left-24 w-48 h-48 ${current.bg} blur-[100px] rounded-full`}
        />

        <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className='text-7xl'>
          {current.icon}
        </motion.div>

        <div className='space-y-4'>
          <h1
            className={`text-4xl font-black tracking-tighter ${current.color}`}
          >
            {current.title}
          </h1>
          <p className='text-xl font-bold text-white tracking-tight'>
            {current.subtitle}
          </p>
          <p className='text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto'>
            {current.description}
          </p>
        </div>

        <div className='pt-8 flex flex-col gap-4'>
          <Link
            href='/orders'
            className='w-full py-4 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all transform hover:-translate-y-1 active:scale-95'
          >
            Ver mis pedidos
          </Link>
          <Link
            href='/catalog'
            className='w-full py-4 rounded-2xl border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all'
          >
            Volver a la tienda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
