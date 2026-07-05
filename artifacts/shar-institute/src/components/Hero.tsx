import { motion } from 'framer-motion';
import { Users, BookOpen, UserCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { t, dir } = useLanguage();

  const stats = [
    { icon: Users, label: t('heroStats1Label'), value: t('heroStats1Value') },
    { icon: BookOpen, label: t('heroStats2Label'), value: t('heroStats2Value') },
    { icon: UserCheck, label: t('heroStats3Label'), value: t('heroStats3Value') },
  ];

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] flex flex-col justify-center bg-primary overflow-hidden pt-20"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 85% 30%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 40%)
        `
      }}
    >
      {/* Abstract geometric overlay */}
      <div className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex justify-center"
          >
            <div className="w-16 h-1 bg-accent rounded-full" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight md:leading-tight lg:leading-tight mb-6"
          >
            {t('heroTagline')}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {t('heroSubtitle')}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base h-14 px-8 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg"
              onClick={() => handleScroll('#register')}
            >
              {t('heroCtaEnroll')}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto text-base h-14 px-8 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent backdrop-blur-sm"
              onClick={() => handleScroll('#courses')}
            >
              {t('heroCtaCourses')}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="container mx-auto px-4 md:px-6 relative z-20 translate-y-1/2 mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="bg-card rounded-xl shadow-xl p-6 border border-border flex items-center gap-4 hover:-translate-y-1 transition-transform"
              dir={dir}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
