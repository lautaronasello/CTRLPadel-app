'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();
  const { user, loginWithGoogle } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]'
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border z-[101] shadow-2xl flex flex-col'
          >
            {/* Header */}
            <div className='p-6 border-b border-border flex items-center justify-between'>
              <div>
                <h2 className='text-2xl font-black tracking-tighter text-foreground'>
                  TU CARRITO
                </h2>
                <p className='text-muted text-xs font-bold uppercase tracking-widest'>
                  {totalItems} productos
                </p>
              </div>
              <button
                onClick={onClose}
                className='p-2 hover:bg-border rounded-full transition-colors text-foreground'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M18 6 6 18' />
                  <path d='m6 6 12 12' />
                </svg>
              </button>
            </div>

            {/* Test Environment Warning Banner */}
            <div className='mx-6 mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-400'>
              <span className='text-xl flex-shrink-0'>⚠️</span>
              <div className='text-xs font-medium leading-relaxed'>
                <p className='font-bold uppercase tracking-wider text-[11px] mb-0.5 text-amber-300'>
                  Modo de Demostración
                </p>
                Este sitio es una versión de prueba.{' '}
                <strong className='text-amber-200'>
                  Podes continuar tu compra hasta el checkout de mercado pago
                  pero no ingreses datos personales ni realices pagos reales
                </strong>
                .
              </div>
            </div>

            {/* Items */}
            <div className='flex-1 overflow-y-auto p-6 space-y-6'>
              {cart.length === 0 ? (
                <div className='h-full flex flex-col items-center justify-center text-center space-y-4'>
                  <div className='text-6xl'>🛒</div>
                  <p className='text-muted font-medium'>
                    Tu carrito está vacío
                  </p>
                  <button
                    onClick={onClose}
                    className='text-primary text-sm font-bold uppercase tracking-widest hover:underline'
                  >
                    Ir a comprar
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className='flex gap-4 group'>
                    <div className='relative w-20 h-20 rounded-xl overflow-hidden bg-background border border-border flex-shrink-0'>
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 space-y-1'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='text-sm font-bold text-foreground leading-tight'>
                            {item.name}
                          </h3>
                          <p className='text-[10px] text-muted font-bold uppercase tracking-widest'>
                            {item.brand}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className='text-muted hover:text-red-500 transition-colors'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='16'
                            height='16'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path d='M3 6h18' />
                            <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
                            <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
                          </svg>
                        </button>
                      </div>
                      <div className='flex justify-between items-center pt-2'>
                        <div className='flex items-center rounded-lg border border-border bg-background overflow-hidden'>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className='px-2 py-1 hover:text-primary transition-colors text-xs text-foreground'
                          >
                            -
                          </button>
                          <span className='px-2 text-xs font-bold text-foreground'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className='px-2 py-1 hover:text-primary transition-colors text-xs text-foreground'
                          >
                            +
                          </button>
                        </div>
                        <div className='text-sm font-black text-foreground'>
                          $ {item.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className='p-8 bg-background border-t border-border space-y-6'>
                <div className='flex justify-between items-end'>
                  <span className='text-muted text-xs font-bold uppercase tracking-widest'>
                    Total
                  </span>
                  <span className='text-3xl font-black text-foreground'>
                    <span className='text-primary text-sm font-normal mr-1'>
                      $
                    </span>
                    {totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className='w-full py-5 rounded-2xl primary-gradient text-black font-black text-xl hover:shadow-[0_0_40px_-10px_rgba(204,255,0,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none'
                >
                  {isProcessing ? 'PROCESANDO...' : 'FINALIZAR COMPRA'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
