'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AiFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // No mostrar el botón si ya estamos en la página del wizard
  useEffect(() => {
    const timer = setTimeout(() => {
      if (pathname !== '/wizard') {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-8 right-8 z-50'>
      <Link href='/wizard'>
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.05 }}
          className='relative flex items-center'
        >
          {/* Aura / Glow Effect */}
          <div className='absolute inset-0 bg-primary/40 blur-2xl rounded-full animate-pulse' />

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: -10, width: 'auto' }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                className='absolute right-full mr-4 overflow-hidden whitespace-nowrap bg-black/80 backdrop-blur-md border border-primary/30 py-2 px-4 rounded-full'
              >
                <span className='text-white! font-black text-[10px] uppercase tracking-widest'>
                  ¿Necesitás ayuda? Probá el AI Wizard
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Button */}
          <div className='relative group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-primary to-emerald-400 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt'></div>
            <button className='relative flex items-center justify-center w-16 h-16 bg-black rounded-full border border-primary/50 text-primary shadow-2xl overflow-hidden'>
              {/* Spinning background effect */}
              <div className='absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(204,255,0,0.2),transparent)] animate-[spin_4s_linear_infinite]' />

              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='w-8 h-8 relative z-10'
              >
                <path d='M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454z' />
                <path d='M12 10V3' />
                <path d='M12 21v-7' />
                <path d='M16.24 7.76l4.95-4.95' />
                <path d='M2.81 21.19l4.95-4.95' />
                <path d='M3 12h7' />
                <path d='M14 12h7' />
                <path d='M7.76 16.24l-4.95 4.95' />
                <path d='M21.19 2.81l-4.95 4.95' />
              </svg>

              {/* Shine effect */}
              <div className='absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-[shimmer_2s_infinite]' />
            </button>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
