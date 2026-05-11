'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import CartDrawer from './CartDrawer';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, userData, loginWithGoogle, logout } = useAuth();
  const { totalItems, isCartOpen, openCart, closeCart } = useCart();

  return (
    <>
      <nav className='fixed top-0 left-0 right-0 z-50 flex justify-center p-6'>
        <div className='flex items-center justify-between w-full max-w-7xl px-8 py-4 glass rounded-2xl border-white/10 shadow-2xl'>
          <Link href='/' className='flex items-center gap-2'>
            <div className='w-8 h-8 primary-gradient rounded-lg flex items-center justify-center font-bold text-black text-xl'>
              C
            </div>
            <span className='text-xl font-bold tracking-tighter uppercase text-foreground'>
              CTRL <span className='text-primary'>PADEL</span>
            </span>
          </Link>

          <div className='hidden md:flex items-center gap-8'>
            <Link
              href='/catalog'
              className='text-sm font-medium hover:text-primary transition-colors text-foreground'
            >
              Catálogo
            </Link>
            <Link
              href='/wizard'
              className='text-sm font-medium hover:text-primary transition-colors text-foreground'
            >
              AI Wizard
            </Link>
            <Link
              href='/orders'
              className='text-sm font-medium hover:text-primary transition-colors text-foreground'
            >
              Mis Pedidos
            </Link>
            {userData?.role === 'ADMIN' && (
              <Link
                href='/admin'
                className='text-sm font-medium hover:text-primary transition-colors text-foreground'
              >
                Panel Administrador
              </Link>
            )}
          </div>

          <div className='flex items-center gap-4'>
            {/* <ThemeToggle /> */}

            {/* Cart Icon */}
            <button
              onClick={() => openCart()}
              className='relative p-2 hover:bg-white/5 rounded-full transition-all group'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-muted group-hover:text-primary transition-colors'
              >
                <circle cx='8' cy='21' r='1' />
                <circle cx='19' cy='21' r='1' />
                <path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12' />
              </svg>
              {totalItems > 0 && (
                <span className='absolute -top-1 -right-1 w-5 h-5 primary-gradient rounded-full flex items-center justify-center text-[10px] font-black text-black'>
                  {totalItems}
                </span>
              )}
            </button>

            {user ? (
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      width={32}
                      height={32}
                      className='rounded-full border border-primary/50'
                    />
                  )}
                </div>
                <button
                  onClick={logout}
                  className='px-4 py-2 rounded-full border border-border text-foreground text-xs font-semibold hover:bg-card transition-all'
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className='px-5 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-primary hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95'
              >
                Ingresar
              </button>
            )}
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
