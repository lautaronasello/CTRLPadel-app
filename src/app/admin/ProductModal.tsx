'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
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
  const [uploading, setUploading] = useState(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataCloudinary = new FormData();
    formDataCloudinary.append('file', file);
    formDataCloudinary.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formDataCloudinary,
        }
      );
      const data = await res.json();
      if (data.secure_url) {
        setFormData({ ...formData, imageUrl: data.secure_url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

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
        name: formData.brand ? `${formData.brand} - ${formData.name}` : formData.name,
        description: formData.description,
        category: formData.category,
        imageUrl: formData.imageUrl,
        variants: [
          {
            sku: `${formData.name.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`,
            name: "Única",
            price: Number(formData.price),
            stock: Number(formData.stock),
            attributes: {
              size: "Standard",
              color: "Default"
            }
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
          
          {/* Image Upload Area */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted">Imagen del Producto</label>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-32 h-32 bg-muted/20 rounded-2xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden group relative">
                {formData.imageUrl ? (
                  <>
                    <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="text-white" size={24} />
                    </div>
                  </>
                ) : (
                  <ImageIcon className="text-muted" size={32} />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-card/80 flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <label className="cursor-pointer bg-foreground text-background px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary hover:text-black transition-all">
                    <Upload size={14} />
                    {uploading ? 'Subiendo...' : 'Subir Foto'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                  {formData.imageUrl && (
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, imageUrl: ''})}
                      className="text-red-500 text-[10px] font-bold uppercase tracking-widest hover:underline"
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-muted italic">Formatos: JPG, PNG, WEBP. Tamaño máx: 5MB.</p>
                <input 
                  type="text" 
                  className="w-full bg-background/50 border border-border rounded-xl py-2 px-3 outline-none focus:border-primary transition-all text-[10px]"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="O pega una URL directa aquí..."
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
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
