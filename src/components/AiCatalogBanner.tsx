'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AiCatalogBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='col-span-full mt-8 mb-12'
    >
      <div className='relative overflow-hidden rounded-[32px] glass border border-primary/20 bg-primary/5 p-8 md:p-12'>
        {/* Background Decorative Elements */}
        <div className='absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -mr-20 -mt-20' />
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full -ml-10 -mb-10' />

        <div className='relative z-10 flex flex-col md:flex-row items-center justify-between gap-8'>
          <div className='space-y-4 text-center md:text-left'>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest'>
              ¿Indeciso?
            </div>
            <h3 className='text-3xl md:text-4xl font-black tracking-tighter text-foreground leading-none'>
              DEJÁ QUE NUESTRA <span className='text-primary italic'>IA</span>{' '}
              ELIJA POR VOS
            </h3>
            <p className='text-muted text-sm md:text-base font-light max-w-xl'>
              Analizamos tu nivel, presupuesto y estilo de juego para
              recomendarte la pala que realmente necesitás. Evitá errores y
              comprá con confianza.
            </p>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <Link
              href='/wizard'
              className='px-8 py-4 bg-primary dark:text-black! light:text-white! font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:scale-105 hover:shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all whitespace-nowrap'
            >
              PROBAR WIZARD GRATIS
            </Link>
            <span className='text-[10px] text-muted font-bold uppercase tracking-widest opacity-60'>
              Solo te tomará alrededor de 30 segundos
            </span>
          </div>
        </div>

        {/* Animated Scan Line (Sutil) */}
        <div className='absolute inset-0 pointer-events-none opacity-20'>
          <div className='absolute top-0 left-0 w-full h-[1px] bg-primary animate-[scan_6s_infinite]' />
        </div>
      </div>
    </motion.div>
  );
}
