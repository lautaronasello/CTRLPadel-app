'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    imageUrl?: string;
    variants: Array<{
      price: number;
      stock: number;
      imageUrl?: string;
    }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainVariant = product.variants[0];
  const price = mainVariant?.price || 0;
  const image = (product as any).imageUrl || mainVariant?.imageUrl || '/next.svg';

  return (
    <Link href={`/catalog/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
        className='group relative flex flex-col glass rounded-3xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 shadow-xl h-full cursor-pointer'
      >
        {/* Brand Badge */}
        <div className='absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-bold uppercase tracking-widest text-primary'>
          {product.brand}
        </div>

        {/* Image Container */}
        <div className='relative aspect-square w-full overflow-hidden bg-card'>
          <Image
            src={image}
            alt={product.name}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-110'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        </div>

        {/* Content */}
        <div className='p-6 space-y-3'>
          <div className='space-y-1'>
            <p className='text-muted text-[10px] uppercase tracking-widest font-bold'>
              {product.category}
            </p>
            <h3 className='text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1'>
              {product.name}
            </h3>
          </div>

          <p className='text-muted text-sm line-clamp-2 font-light leading-relaxed'>
            {product.description}
          </p>

          <div className='flex items-center justify-between pt-4'>
            <div className='text-2xl font-black text-foreground'>
              <span className='text-primary text-sm font-normal mr-1'>$</span>
              {price.toLocaleString()}
            </div>

            <div className='h-10 w-10 rounded-full primary-gradient flex items-center justify-center text-black shadow-lg shadow-primary/20 group-hover:scale-110 active:scale-95 transition-all'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M5 12h14m-7-7v14' />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
