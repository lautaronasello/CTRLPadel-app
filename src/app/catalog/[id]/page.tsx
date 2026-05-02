'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        const data = await res.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Producto no encontrado</h2>
        <Link href="/catalog" className="text-primary hover:underline">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Link href="/catalog" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-12 group">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Volver al Catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-3xl overflow-hidden glass border border-white/5"
        >
          <Image
            src={product.imageUrl || selectedVariant?.imageUrl || '/next.svg'}
            alt={product.name}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Right: Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                {product.brand}
              </span>
              <span className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
                {product.category}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none">
              {product.name}
            </h1>
            <p className="text-muted text-xl font-normal leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-5xl font-black text-foreground">
              <span className="text-primary text-xl font-normal mr-2">$</span>
              {selectedVariant?.price.toLocaleString()}
            </div>

            {/* Stock Info */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`h-2 w-2 rounded-full ${selectedVariant?.stock > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
              <span className={selectedVariant?.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                {selectedVariant?.stock > 0 ? `En stock (${selectedVariant.stock} unidades)` : 'Sin stock'}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <button 
              onClick={() => addToCart(product)}
              disabled={selectedVariant?.stock === 0}
              className="w-full py-5 rounded-2xl primary-gradient text-black font-black text-xl hover:shadow-[0_0_50px_-10px_rgba(204,255,0,0.6)] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
            >
              AÑADIR AL CARRITO
            </button>
            <p className="text-center text-muted text-xs uppercase tracking-widest font-bold">
              Envío gratis a todo el país • Garantía oficial
            </p>
          </div>

          {/* Specs / Features Grid */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            {[
              { label: "Material", value: "Carbono 12K" },
              { label: "Forma", value: "Lágrima" },
              { label: "Balance", value: "Medio-Alto" },
              { label: "Nivel", value: "Avanzado / Pro" },
            ].map((spec, i) => (
              <div key={i} className="p-4 glass rounded-2xl border border-border space-y-1">
                <div className="text-muted text-[10px] uppercase tracking-widest font-bold">{spec.label}</div>
                <div className="text-foreground text-sm font-semibold">{spec.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
