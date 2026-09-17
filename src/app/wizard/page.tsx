'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { error } from 'console';

const STEPS = [
  {
    id: 'level',
    title: '¿Cuál es tu nivel?',
    options: [
      { label: 'Principiante', value: 'BEGINNER', icon: '🐣' },
      { label: 'Intermedio', value: 'INTERMEDIATE', icon: '🎾' },
      { label: 'Avanzado', value: 'ADVANCED', icon: '🔥' },
      { label: 'Profesional', value: 'PRO', icon: '🏆' },
    ],
  },
  {
    id: 'style',
    title: '¿Cuál es tu estilo de juego?',
    options: [
      {
        label: 'Control',
        value: 'CONTROL',
        description: 'Busco precisión y toque',
        icon: '🎯',
      },
      {
        label: 'Potencia',
        value: 'POWER',
        description: 'Quiero reventar la bola',
        icon: '💥',
      },
      {
        label: 'Híbrido',
        value: 'HYBRID',
        description: 'Un poco de ambos',
        icon: '⚖️',
      },
    ],
  },
  {
    id: 'frequency',
    title: '¿Con qué frecuencia jugás?',
    options: [
      {
        label: 'Ocasional',
        value: '1',
        description: 'Una vez por semana',
        icon: '🧘',
      },
      {
        label: 'Regular',
        value: '3',
        description: '2-3 veces por semana',
        icon: '🏃',
      },
      {
        label: 'Intensivo',
        value: '5',
        description: 'Casi todos los días',
        icon: '🦾',
      },
    ],
  },
  {
    id: 'budget',
    title: '¿Cuál es tu presupuesto máximo?',
    type: 'range',
    min: 50000,
    max: 500000,
    step: 10000,
  },
];

export default function AiWizardPage() {
  const { user, getToken, loginWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({ budget: 250000 });
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  const handleOptionSelect = (value: string) => {
    const field = STEPS[currentStep].id;
    setFormData({ ...formData, [field]: value });

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setErrorMsg(
        '¡Hola! Para usar nuestro Asistente de IA y recibir las mejores recomendaciones, por favor inicia sesión. ¡Es gratis y te ayudará a encontrar tu pala ideal!',
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/recommend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            level: formData.level,
            style: formData.style,
            frequency: parseInt(formData.frequency),
            budget: formData.budget,
          }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || 'Error al obtener la recomendación',
        );
      }

      const data = await res.json();
      setResult(data);

      // Fetch actual product details for the recommendations
      if (data.recommendedProductIds && data.recommendedProductIds.length > 0) {
        const productPromises = data.recommendedProductIds.map((id: string) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`).then((r) =>
            r.json(),
          ),
        );
        const products = await Promise.all(productPromises);
        setRecommendedProducts(products.filter((p) => p.id));
      }
    } catch (error: any) {
      console.error('Error in AI Wizard:', error);
      setErrorMsg(
        error.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className='min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center space-y-4'
        >
          <h1 className='text-5xl font-black tracking-tighter text-foreground'>
            TU <span className='text-primary italic'>RECOMENDACIÓN</span> AI
          </h1>
          <p className='text-muted text-lg max-w-2xl mx-auto'>
            {result.explanation}
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {recommendedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='glass p-8 rounded-3xl border border-primary/20 bg-primary/5 text-center'
        >
          <span className='text-primary text-xs font-bold uppercase tracking-widest block mb-2'>
            Consejo Pro
          </span>
          <p className='text-foreground text-xl font-medium italic'>
            "{result.advice}"
          </p>
        </motion.div>

        <div className='flex justify-center'>
          <button
            onClick={() => {
              setResult(null);
              setCurrentStep(0);
            }}
            className='text-muted hover:text-primary transition-colors text-sm uppercase tracking-widest font-bold'
          >
            Volver a empezar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto flex flex-col items-center'>
      <AnimatePresence mode='wait'>
        {loading ? (
          <motion.div
            key='loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='flex flex-col items-center space-y-8 py-20'
          >
            <div className='relative w-24 h-24'>
              <div className='absolute inset-0 border-4 border-primary/20 rounded-full' />
              <div className='absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin' />
              <div className='absolute inset-4 bg-primary/10 rounded-full animate-pulse' />
            </div>
            <div className='text-center space-y-2'>
              <h2 className='text-2xl font-bold tracking-tighter animate-pulse text-foreground uppercase'>
                Analizando tu perfil...
              </h2>
              <p className='text-muted text-sm uppercase tracking-widest font-bold'>
                Escaneando catálogo real en tiempo real
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className='w-full space-y-10'
          >
            <div className='text-center space-y-2'>
              <span className='text-primary text-xs font-bold tracking-widest uppercase'>
                Paso {currentStep + 1} de {STEPS.length}
              </span>
              <h2 className='text-4xl md:text-5xl font-bold tracking-tighter text-foreground'>
                {STEPS[currentStep].title}
              </h2>
            </div>

            {STEPS[currentStep].type === 'range' ? (
              <div className='space-y-10 py-10'>
                <div className='text-center'>
                  <span className='text-5xl font-black text-foreground'>
                    $ {formData.budget.toLocaleString()}
                  </span>
                </div>
                <input
                  type='range'
                  min={STEPS[currentStep].min}
                  max={STEPS[currentStep].max}
                  step={STEPS[currentStep].step}
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      budget: parseInt(e.target.value),
                    })
                  }
                  className='w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary'
                />
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-4'
                  >
                    <p className='text-red-500 text-sm font-medium'>
                      {errorMsg}
                    </p>
                    {!user && (
                      <button
                        onClick={loginWithGoogle}
                        className='px-6 py-2 bg-primary text-black! rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all'
                      >
                        Iniciar Sesión ahora
                      </button>
                    )}
                  </motion.div>
                )}
                <button
                  onClick={handleSubmit}
                  className='w-full py-5 rounded-2xl primary-gradient text-black font-black text-xl hover:shadow-[0_0_50px_-10px_rgba(204,255,0,0.6)] transition-all'
                >
                  OBTENER RECOMENDACIÓN
                </button>
              </div>
            ) : (
              <div className='grid grid-cols-1 gap-4'>
                {STEPS[currentStep].options?.map((option: any) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className='group relative flex items-center p-6 glass border-border rounded-2xl hover:border-primary/40 transition-all text-left overflow-hidden'
                  >
                    <div className='absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity' />
                    <div className='text-4xl mr-6'>{option.icon}</div>
                    <div className='flex-1'>
                      <div className='text-xl font-bold text-foreground group-hover:text-primary transition-colors'>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className='text-muted text-sm font-light'>
                          {option.description}
                        </div>
                      )}
                    </div>
                    <div className='w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='3'
                        className='text-transparent group-hover:text-black'
                      >
                        <path d='M5 12l5 5L20 7' />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className='w-full text-muted hover:text-foreground transition-colors text-xs font-bold uppercase tracking-widest mt-8'
              >
                Volver al paso anterior
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
