'use client';

import { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, ExternalLink, Loader2 } from 'lucide-react';

interface Order {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  user: {
    name: string | null;
    email: string;
  };
  items: any[];
}

interface OrdersTableProps {
  getToken: () => Promise<string | null>;
}

export default function OrdersTable({ getToken }: OrdersTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      console.log('Datos de pedidos recibidos:', data);

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('La API no devolvió una lista:', data);
        alert(`Error de la API: ${data.message || JSON.stringify(data)}`);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={14} className="text-amber-500" />;
      case 'PAID': return <Package size={14} className="text-blue-500" />;
      case 'SHIPPED': return <Truck size={14} className="text-purple-500" />;
      case 'DELIVERED': return <CheckCircle size={14} className="text-primary" />;
      case 'CANCELLED': return <XCircle size={14} className="text-red-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'PAID': return 'Pagado';
      case 'SHIPPED': return 'Enviado';
      case 'DELIVERED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 text-muted uppercase text-[10px] font-black tracking-widest">
              <th className="px-6 py-4">Pedido / Cliente</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-bold text-foreground text-sm leading-tight">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted">{order.user?.name || 'Cliente'}</p>
                    <p className="text-[10px] text-muted/60">{order.user?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-muted">
                    {new Date(order.id.length > 20 ? Date.now() : 0).toLocaleDateString()} 
                    {/* Nota: Usar createdAt real si se agrega al schema */}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-foreground text-sm">${order.totalAmount?.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 bg-muted/20 w-fit px-3 py-1 rounded-full border border-border/50">
                    {getStatusIcon(order.status)}
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <select 
                      disabled={updatingId === order.id}
                      className="bg-background border border-border rounded-lg px-2 py-1 text-[10px] font-bold outline-none focus:border-primary disabled:opacity-50"
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pendiente</option>
                      <option value="PAID">Pagado</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                    
                    <button className="text-muted hover:text-primary transition-colors" title="Detalles">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted italic">No hay pedidos registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}
