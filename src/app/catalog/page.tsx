'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    setProducts([]);

    let cancelled = false;

    async function fetchProducts() {
      try {
        const url = category
          ? `${process.env.NEXT_PUBLIC_API_URL}/products?category=${category}`
          : `${process.env.NEXT_PUBLIC_API_URL}/products`;
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

    return () => { cancelled = true; };
  }, [category]);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-foreground">
          NUESTRO <span className="text-primary italic">CATÁLOGO</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl font-light">
          Selección exclusiva de las mejores paletas del mundo, curadas por expertos y optimizadas con nuestra IA.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 border-b border-border pb-8">
        {[
          { label: 'TODOS',      value: '' },
          { label: 'PALETAS',    value: 'RACKET' },
          { label: 'BOLSOS',     value: 'BAG' },
          { label: 'ACCESORIOS', value: 'ACCESSORY' },
        ].map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-6 py-2 rounded-full border transition-all text-xs font-bold tracking-widest uppercase ${
              category === cat.value
                ? 'bg-primary text-black border-primary'
                : 'bg-transparent text-foreground border-border hover:border-primary/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-card animate-pulse rounded-3xl" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4">
          <p className="text-muted text-xl">No encontramos productos en esta categoría.</p>
          <button 
            onClick={() => setCategory('')}
            className="text-primary font-bold hover:underline"
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
}
