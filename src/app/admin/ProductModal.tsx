'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Product, Category } from '@/types/product';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: Product | null;
  getToken: () => Promise<string | null>;
}

export default function ProductModal({ isOpen, onClose, onSave, product, getToken }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    category: 'RACKET' as Category,
    price: 0,
    stock: 0,
    imageUrl: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        description: product.description || '',
        category: product.category,
        price: product.variants[0]?.price || 0,
        stock: product.variants[0]?.stock || 0,
        imageUrl: product.variants[0]?.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        brand: '',
        description: '',
        category: 'RACKET',
        price: 0,
        stock: 0,
        imageUrl: '',
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const url = product 
        ? `${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/products`;
      
      const method = product ? 'PATCH' : 'POST';

      const body = {
        name: formData.name,
        brand: formData.brand,
        description: formData.description,
        category: formData.category,
        variants: [
          {
            price: Number(formData.price),
            stock: Number(formData.stock),
            imageUrl: formData.imageUrl,
            size: "Standard",
            color: "Default"
          }
        ]
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        onSave();
        onClose();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'No se pudo guardar el producto'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/5">
          <h2 className="text-xl font-black tracking-tighter text-foreground uppercase">
            {product ? 'Editar' : 'Nuevo'} <span className="text-primary italic">Producto</span>
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted">Nombre del Producto</label>
              <input 
                required
                type="text" 
                className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ej: Vertex 04 2024"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted">Marca</label>
              <input 
                required
                type="text" 
                className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="Ej: Bullpadel"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted">Descripción</label>
            <textarea 
              rows={3}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detalles técnicos, balance, forma..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted">Categoría</label>
              <select 
                className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
              >
                <option value="RACKET">Paleta</option>
                <option value="BAG">Bolso</option>
                <option value="ACCESSORY">Accesorio</option>
                <option value="CLOTHING">Indumentaria</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted">Precio (ARS)</label>
              <input 
                required
                type="number" 
                className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm font-bold text-primary"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted">Stock Inicial</label>
              <input 
                required
                type="number" 
                className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted">URL de Imagen</label>
              <input 
                type="text" 
                className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-all text-sm"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                placeholder="https://..."
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/5 flex items-center justify-end gap-4">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-muted transition-all"
          >
            Cancelar
          </button>
          <button 
            disabled={loading}
            onClick={handleSubmit}
            className="bg-primary text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {product ? 'Actualizar' : 'Crear Producto'}
          </button>
        </div>
      </div>
    </div>
  );
}
