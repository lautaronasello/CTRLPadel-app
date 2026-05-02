import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col items-center overflow-hidden px-6'>
      {/* Hero Section */}
      <section className='relative w-full max-w-7xl pt-10 pb-20 flex flex-col items-center'>
        {/* Background Glows */}
        <div className='absolute top-0 -left-20 w-72 h-72 bg-primary/20 blur-[120px] rounded-full' />
        <div className='absolute bottom-0 -right-20 w-96 h-96 bg-primary/10 blur-[150px] rounded-full' />

        <div className='z-10 text-center space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-1000'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold tracking-widest uppercase mb-4'>
            <span className='relative flex h-2 w-2'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
              <span className='relative inline-flex rounded-full h-2 w-2 bg-primary'></span>
            </span>
            Nueva Colección 2026
          </div>

          <h1 className='text-6xl md:text-8xl font-bold tracking-tighter leading-tight max-w-4xl mx-auto text-foreground'>
            DOMINÁ LA CANCHA CON <br />
            <span className='text-primary italic'>TECNOLOGÍA</span> Y{' '}
            <span className='text-gradient'>ESTILO</span>
          </h1>

          <p className='text-muted text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed'>
            La primera tienda de pádel que utiliza Inteligencia Artificial para
            encontrar tu paleta perfecta. Calidad premium, envíos express y el
            mejor asesoramiento.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center gap-6 pt-4'>
            <Link
              href={'/catalog'}
              className='px-10 py-4 rounded-full primary-gradient text-black font-bold text-lg hover:shadow-[0_0_40px_-10px_rgba(204,255,0,0.5)] transition-all transform hover:-translate-y-1'
            >
              Explorar Catálogo
            </Link>
            <Link
              href={'/wizard'}
              className='px-10 py-4 rounded-full glass border-border text-foreground font-semibold text-lg hover:bg-foreground/5 transition-all'
            >
              Hablar con AI Wizard
            </Link>
          </div>
        </div>

        {/* Featured Image / Product */}
        <div className='relative mt-20 w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-border shadow-2xl animate-in fade-in zoom-in duration-1000 delay-300'>
          <Image
            src='/padel_hero_bg.png'
            alt='Professional Padel Racket'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent' />
        </div>
      </section>

      {/* Stats / Proof Section */}
      <section className='w-full max-w-7xl py-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border'>
        {[
          { label: 'Clientes Felices', value: '5k+' },
          { label: 'Paletas en Stock', value: '120+' },
          { label: 'Tiempo de Entrega', value: '24hs' },
          { label: 'Precisión AI', value: '99%' },
        ].map((stat, i) => (
          <div key={i} className='text-center space-y-1'>
            <div className='text-3xl font-bold text-primary tracking-tighter'>
              {stat.value}
            </div>
            <div className='text-xs text-muted uppercase tracking-widest'>
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
