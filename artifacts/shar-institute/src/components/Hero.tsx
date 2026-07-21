import { motion } from 'framer-motion';
import { Users, BookOpen, UserCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { t, dir } = useLanguage();

  const stats = [
    { icon: Users,     label: t('heroStats1Label'), value: t('heroStats1Value') },
    { icon: BookOpen,  label: t('heroStats2Label'), value: t('heroStats2Value') },
    { icon: UserCheck, label: t('heroStats3Label'), value: t('heroStats3Value') },
  ];

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section
        id="home"
        className="relative min-h-[88vh] flex flex-col justify-center bg-primary pt-20 pb-28"
        style={{
          background: `
            radial-gradient(ellipse at 15% 60%, rgba(245,158,11,0.10) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 25%, rgba(255,255,255,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 90%, rgba(255,255,255,0.03) 0%, transparent 40%),
            hsl(220 60% 18%)
          `,
        }}
      >
        {/* Decorative grid — overflow clipped inside its own wrapper, not the section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
              transform: 'perspective(600px) rotateX(55deg) translateY(-80px)',
              transformOrigin: 'top center',
            }}
          />
          {/* Gold accent orb */}
          <div
            className="absolute rounded-full"
            style={{
              width: 480,
              height: 480,
              top: '-80px',
              right: '-120px',
              background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 320,
              height: 320,
              bottom: '60px',
              left: '-80px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
        </div>

        {/* Hero content */}
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          {/* Gold accent bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-20 h-1.5 bg-accent rounded-full" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.15] mb-6 max-w-4xl"
            style={{ textShadow: '0 2px 24px rgba(0,0,0,0.25)' }}
          >
            {t('heroTagline')}
          </motion.h1>

          {/* Gold underline accent under headline */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 120 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="h-0.5 bg-accent/60 rounded-full mb-7"
          />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-white/75 mb-4 max-w-2xl leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>

          {/* Hero note */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="text-base md:text-lg text-accent/90 font-semibold mb-10 max-w-2xl leading-relaxed"
          >
            {t('heroNote')}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="w-full sm:w-auto text-base font-bold h-14 px-10 bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl hover:shadow-accent/25 hover:-translate-y-0.5 transition-all"
              onClick={() => handleScroll('#register')}
            >
              {t('heroCtaEnroll')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-base font-semibold h-14 px-10 border-white/25 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm hover:-translate-y-0.5 transition-all"
              onClick={() => handleScroll('#courses')}
            >
              {t('heroCtaCourses')}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar — sits below hero, overlaps with -mt ──────── */}
      <div className="relative z-20 -mt-14" dir={dir}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.45 + index * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 flex items-center gap-5 px-6 py-5 hover:-translate-y-1 transition-transform duration-300"
                style={{
                  boxShadow: '0 8px 32px -4px rgba(15,23,65,0.15), 0 2px 8px rgba(15,23,65,0.08)',
                }}
              >
                {/* Icon */}
                <div className="w-13 h-13 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 p-3">
                  <stat.icon className="w-6 h-6" />
                </div>
                {/* Text */}
                <div className="min-w-0">
                  <div
                    className="text-3xl font-black text-primary leading-none mb-1"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
