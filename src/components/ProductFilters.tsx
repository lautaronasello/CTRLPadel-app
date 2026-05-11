'use client';

import { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  activeFilters: any;
}

export default function ProductFilters({ onFilterChange, activeFilters }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false); // Mobile Drawer
  const [showAdvanced, setShowAdvanced] = useState(false);

  const brands = ['Bullpadel', 'Nox', 'Babolat', 'Wilson', 'Head', 'Adidas', 'Varlion'];
  const styles = [
    { label: 'Control', value: 'CONTROL' },
    { label: 'Potencia', value: 'POWER' },
    { label: 'Polivalente', value: 'VERSATILE' }
  ];
  
  const advancedFilters = [
    { 
      id: 'level', 
      label: 'Nivel', 
      options: [
        { label: 'Principiante', value: 'BEGINNER' },
        { label: 'Intermedio', value: 'INTERMEDIATE' },
        { label: 'Avanzado', value: 'ADVANCED' }
      ] 
    },
    { 
      id: 'shape', 
      label: 'Forma', 
      options: [
        { label: 'Redonda', value: 'ROUND' },
        { label: 'Lágrima', value: 'TEARDROP' },
        { label: 'Diamante', value: 'DIAMOND' }
      ] 
    },
    { 
      id: 'balance', 
      label: 'Balance', 
      options: [
        { label: 'Bajo', value: 'LOW' },
        { label: 'Medio', value: 'MEDIUM' },
        { label: 'Alto', value: 'HIGH' }
      ] 
    },
    { 
      id: 'touch', 
      label: 'Tacto', 
      options: [
        { label: 'Blando', value: 'SOFT' },
        { label: 'Medio', value: 'MEDIUM' },
        { label: 'Duro', value: 'HARD' }
      ] 
    }
  ];

  const handleToggle = (key: string, value: string) => {
    const current = activeFilters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    onFilterChange({ ...activeFilters, [key]: updated });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...activeFilters, maxPrice: Number(e.target.value) });
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Brand Filter */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Marca</h3>
        <div className="grid grid-cols-2 gap-2">
          {brands.map(brand => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border-2 ${
                activeFilters.brand?.includes(brand) 
                  ? 'bg-primary border-primary' 
                  : 'border-zinc-300 dark:border-border group-hover:border-primary/50'
              } transition-all flex items-center justify-center`}>
                {activeFilters.brand?.includes(brand) && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={activeFilters.brand?.includes(brand) || false}
                onChange={() => handleToggle('brand', brand)}
              />
              <span className="text-xs text-foreground/80 font-medium group-hover:text-primary transition-colors">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Style Filter */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Estilo de Juego</h3>
        <div className="flex flex-wrap gap-2">
          {styles.map(style => (
            <button
              key={style.value}
              onClick={() => handleToggle('gameStyle', style.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                activeFilters.gameStyle?.includes(style.value)
                  ? 'bg-primary text-black! border-primary'
                  : 'bg-transparent border-zinc-200 dark:border-border text-foreground/60 hover:border-primary/50 hover:text-primary'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Precio Máximo</h3>
          <span className="text-xs font-black text-primary">${activeFilters.maxPrice?.toLocaleString() || '500,000'}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1000000" 
          step="10000"
          value={activeFilters.maxPrice || 500000}
          onChange={handlePriceChange}
          className="w-full accent-primary h-2 bg-zinc-200 dark:bg-muted rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Advanced Filters Accordion */}
      <div className="pt-6 border-t border-zinc-200 dark:border-border">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full group"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Filtros Avanzados</span>
          {showAdvanced ? <ChevronUp size={14} className="text-primary" /> : <ChevronDown size={14} className="text-muted-foreground group-hover:text-primary" />}
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-6 space-y-6">
                {advancedFilters.map(filter => (
                  <div key={filter.id}>
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-3">{filter.label}</h4>
                    <div className="flex flex-wrap gap-2">
                      {filter.options.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleToggle(filter.id, opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border-2 ${
                            activeFilters[filter.id]?.includes(opt.value)
                              ? 'bg-primary text-black! border-primary'
                              : 'border-zinc-200 dark:border-border text-foreground/40 hover:border-primary/30 hover:text-primary'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-card border border-border rounded-3xl p-8 sticky top-32 h-fit max-h-[80vh] overflow-y-auto custom-scrollbar shadow-xl">
        <FilterContent />
      </aside>

      {/* Mobile Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-8 right-8 z-[60] bg-primary text-black w-14 h-14 rounded-full shadow-2xl shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <Filter size={24} />
      </button>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-card z-[80] shadow-2xl p-8 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">Filtrar <span className="text-primary italic">Paletas</span></h2>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X size={20} className="text-foreground" />
                </button>
              </div>
              <FilterContent />
              
              <div className="mt-12">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-primary text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(204,255,0,0.4)] transition-all"
                >
                  Ver Resultados
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
