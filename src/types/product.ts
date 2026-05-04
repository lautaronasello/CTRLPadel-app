export type Category = 'RACKET' | 'BAG' | 'CLOTHING' | 'ACCESSORY';

export interface ProductVariant {
  id: string;
  productId: string;
  size: string | null;
  color: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  brand: string;
  category: Category;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
