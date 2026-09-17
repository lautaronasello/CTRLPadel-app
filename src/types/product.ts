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
  level: string;
  faceMaterial: string;
  nucleus: string;
  touch: string;
  balance: string;
  shape: string;
  gameStyle: string;
  imageUrl: string | null;
  id: string;
  name: string;
  description: string | null;
  brand: string;
  category: Category;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
