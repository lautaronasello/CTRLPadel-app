'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AiFeaturedSection() {
  return (
    <section className="w-full max-w-7xl py-24 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative glass rounded-[40px] p-8 md:p-16 border border-primary/20 overflow-hidden group">
        {/* Animated Background Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-[shimmer_3s_infinite]" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-[10px] font-black tracking-[0.2em] uppercase">
              Tecnología de Vanguardia
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9] text-foreground">
              TU PALA IDEAL,<br />
              <span className="text-primary italic">ESCANEADA</span> POR IA
            </h2>
            
            <p className="text-muted text-lg font-light leading-relaxed max-w-lg">
              No dejes tu juego al azar. Nuestro algoritmo analiza miles de combinaciones técnicas para encontrar la pala que potenciará tus virtudes en la cancha.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                href="/wizard" 
                className="group relative px-8 py-4 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-2xl overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                Iniciar Cuestionario
              </Link>
              <div className="flex -space-x-4 items-center pl-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
                <div className="pl-6 text-xs text-muted font-medium">
                  +1.2k usuarios asesorados hoy
                </div>
              </div>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-video rounded-3xl overflow-hidden border border-border bg-black/40 group-hover:border-primary/30 transition-colors">
            {/* AI Scanning Effect Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(204,255,0,0.8)] animate-[scan_4s_infinite]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
            </div>

            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20">
              {Array.from({ length: 36 }).map((_, i) => (
                <div key={i} className="border-[0.5px] border-primary/20" />
              ))}
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-primary/20 text-8xl font-black italic select-none">AI SCAN</div>
            </div>
            
            {/* Simulación de datos técnicos flotantes */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 right-10 p-4 glass border-primary/20 rounded-2xl z-20 hidden md:block"
            >
              <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Balance</div>
              <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-primary" />
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute bottom-10 left-10 p-4 glass border-primary/20 rounded-2xl z-20 hidden md:block"
            >
              <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">Potencia</div>
              <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="w-[90%] h-full bg-primary" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}
