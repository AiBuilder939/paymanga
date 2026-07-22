import { MapPin, Phone, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PHONES = ['0750 123 4567', '0770 123 4567'];

const SOCIAL = [
  { icon: Facebook,  label: 'Facebook',  href: '#' },
  { icon: Instagram, label: 'Instagram', href: '#' },
  { icon: Youtube,   label: 'YouTube',   href: '#' },
];

export function Contact() {
  const { t, dir } = useLanguage();

  return (
    <section id="contact" className="py-24 bg-background" dir={dir}>
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">

        {/* Heading */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-1 bg-accent rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('contactTitle')}
          </h2>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">

          {/* Phone */}
          <div className="group bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center hover:border-primary/40 hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/8 text-primary flex items-center justify-center mb-5 group-hover:bg-primary/14 transition-colors">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">{t('contactPhone')}</h3>
            <div className="flex flex-col gap-1.5">
              {PHONES.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\s/g, '')}`}
                  className="text-base font-medium text-primary hover:text-primary/80 transition-colors"
                  dir="ltr"
                >
                  {p}
                </a>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="group bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center hover:border-primary/40 hover:shadow-lg transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-primary/8 text-primary flex items-center justify-center mb-5 group-hover:bg-primary/14 transition-colors">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-3">{t('instituteName')}</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {t('contactAddress')}
            </p>
          </div>
        </div>

        {/* Social media */}
        <div className="flex flex-col items-center gap-5">
          <p className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
            {t('contactFollowUs')}
          </p>
          <div className="flex items-center gap-4">
            {SOCIAL.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-12 h-12 rounded-2xl border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
