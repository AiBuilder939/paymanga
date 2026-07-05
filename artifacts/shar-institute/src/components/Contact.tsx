import { MapPin, Phone, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Contact() {
  const { t, dir } = useLanguage();

  const cards = [
    {
      icon: MapPin,
      title: t('instituteName'),
      desc: t('contactAddress'),
    },
    {
      icon: Phone,
      title: t('contactPhone'),
      desc: '0750 123 4567',
      isLtr: true,
    },
    {
      icon: Clock,
      title: 'کاتەکانی دەوام',
      desc: t('contactHours'),
    }
  ];

  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-1 bg-accent rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('contactTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-2xl p-8 text-center flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
              dir={dir}
            >
              <div className="w-16 h-16 rounded-full bg-primary/5 text-primary flex items-center justify-center mb-6">
                <card.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
              <p className="text-muted-foreground" dir={card.isLtr ? 'ltr' : dir}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
