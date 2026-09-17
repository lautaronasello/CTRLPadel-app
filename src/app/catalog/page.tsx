'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import AiCatalogBanner from '@/components/AiCatalogBanner';
import { Product } from '../../types/product';
import { SearchFilters } from '../../types/filters';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    brand: [],
    gameStyle: [],
    level: [],
    shape: [],
    balance: [],
    touch: [],
    maxPrice: 1000000,
  });

  const handleCategoryChange = (catValue: string) => {
    setLoading(true);
    setCategory(catValue);
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setLoading(true);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setLoading(true);
    setCategory('');
    setFilters({
      brand: [],
      gameStyle: [],
      level: [],
      shape: [],
      balance: [],
      touch: [],
      maxPrice: 1000000,
    });
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (filters.maxPrice)
          params.append('maxPrice', filters.maxPrice.toString());

        // Agregar arrays de filtros
        const arrayKeys: (keyof Omit<SearchFilters, 'maxPrice'>)[] = [
          'brand',
          'gameStyle',
          'level',
          'shape',
          'balance',
          'touch',
        ];

        arrayKeys.forEach((key) => {
          const values = filters[key];
          if (values && values.length > 0) {
            // Para simplificar, tomamos el primero o mandamos todos según soporte el back
            // Nuestro back actual toma un valor por query param, así que mandamos el primero si hay
            params.append(key, values[0]);
          }
        });

        const url = `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [category, filters]);

  return (
    <div className='min-h-screen pt-36 pb-20 px-6 max-w-7xl mx-auto'>
      {/* Header */}
      <div className='space-y-4 mb-12'>
        <h1 className='text-5xl md:text-6xl font-bold tracking-tighter text-foreground uppercase'>
          Nuestro <span className='text-primary italic'>Catálogo</span>
        </h1>
        <p className='text-muted text-lg max-w-2xl font-light'>
          Selección exclusiva de las mejores paletas del mundo, curadas por
          expertos y optimizadas con nuestra IA.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-12'>
        {/* Sidebar Filters */}
        <ProductFilters activeFilters={filters} onFilterChange={handleFilterChange} />

        {/* Main Content */}
        <div className='flex-1 space-y-8'>
          {/* Category Chips */}
          <div className='flex flex-wrap gap-3 pb-8 border-b border-border/30'>
            {[
              { label: 'TODOS', value: '' },
              { label: 'PALETAS', value: 'RACKET' },
              { label: 'BOLSOS', value: 'BAG' },
              { label: 'ACCESORIOS', value: 'ACCESSORY' },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-5 py-2 rounded-xl border transition-all text-[10px] font-black tracking-widest uppercase ${
                  category === cat.value
                    ? 'bg-primary text-black! border-primary shadow-[0_0_15px_rgba(204,255,0,0.2)]'
                    : 'text-muted border-border hover:border-primary/50 bg-muted/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='aspect-[4/5] bg-card/50 animate-pulse rounded-3xl border border-border/20'
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8'>
              {products.map((product, index) => (
                <div key={product.id} className='contents'>
                  <ProductCard product={product} />
                  {index === 5 && <AiCatalogBanner />}
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-20 bg-muted/5 rounded-3xl border border-dashed border-border'>
              <p className='text-muted text-lg mb-4'>
                No encontramos productos que coincidan con estos filtros.
              </p>
              <button
                onClick={handleResetFilters}
                className='text-primary font-black uppercase text-xs tracking-widest hover:underline'
              >
                Limpiar filtros y ver todo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
