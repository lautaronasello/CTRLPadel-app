'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems } = useCart();
  const { user, getToken } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    const token = user ? await getToken() : null;

    try {
      const headers: any = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
          shippingData: formData
        })
      });

      const order = await orderRes.json();

      const payRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId: order.id })
      });

      const { init_point } = await payRes.json();
      window.location.href = init_point;
    } catch (error) {
      console.error("Checkout error:", error);
      alert('Hubo un error al procesar tu compra');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass p-12 rounded-[2.5rem] text-center space-y-6">
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">Tu carrito está vacío</h2>
          <button onClick={() => router.push('/catalog')} className="bg-foreground text-background px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Formulario de Envío */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-[0.8]">
            Datos de <span className="text-primary italic">Envío</span>
          </h1>

          <form onSubmit={handleSubmit} className="glass p-8 rounded-[2.5rem] border-border space-y-6">
            {!user && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border/30">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Tu Nombre</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-2">Email de contacto</label>
                  <input 
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="tu@email.com"
                    className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-2">Dirección Completa</label>
              <input 
                required
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Calle, Número, Depto..."
                className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-2">Ciudad</label>
                <input 
                  required
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Ej: Buenos Aires"
                  className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-2">Código Postal</label>
                <input 
                  required
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="1425"
                  className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-2">Teléfono de contacto</label>
              <input 
                required
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+54 9 11 ..."
                className="w-full bg-background/50 border border-border rounded-2xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full primary-gradient py-5 rounded-2xl text-black font-black uppercase tracking-[0.2em] text-sm hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(204,255,0,0.3)]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                'Ir a Pagar con Mercado Pago'
              )}
            </button>
          </form>
        </motion.div>

        {/* Resumen de Compra */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter italic opacity-50">
            Resumen
          </h2>

          <div className="glass p-8 rounded-[2.5rem] border-border space-y-8">
            <div className="max-h-[45vh] overflow-y-auto pr-4 space-y-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-6 bg-background/30 p-4 rounded-2xl border border-border">
                  <div className="w-20 h-20 relative bg-background/50 rounded-xl overflow-hidden border border-border flex-shrink-0">
                    <Image src={item.imageUrl || '/next.svg'} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-foreground font-black uppercase text-sm leading-tight">{item.name}</h3>
                    <p className="text-primary font-black text-lg mt-1">${item.price.toLocaleString()}</p>
                    <p className="text-muted text-[10px] font-bold uppercase mt-1">Cantidad: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex justify-between text-muted text-xs font-bold uppercase tracking-widest">
                <span>Subtotal ({totalItems} productos)</span>
                <span className="text-foreground font-black">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-primary text-xs font-bold uppercase tracking-widest">
                <span>Envío</span>
                <span className="italic underline">¡GRATIS!</span>
              </div>
              <div className="flex justify-between items-end pt-4">
                <span className="text-foreground font-black uppercase text-xl">Total</span>
                <span className="text-4xl font-black text-primary tracking-tighter">${totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
