import { Link } from 'wouter';
import { Facebook, Instagram, Phone as WhatsApp, Phone } from 'lucide-react';

const PHONES = ['0750 119 6540', '0770 762 3252', '0750 185 8773'];
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t, dir } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sidebar pt-16 pb-8 border-t border-sidebar-border" dir={dir}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mb-12">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold text-xl shadow-md">
                  ش
                </div>
                <span className="font-bold text-xl tracking-tight text-sidebar-foreground">
                  {t('instituteName')}
                </span>
              </div>
            </Link>
            <p className="text-sidebar-foreground/70 max-w-sm mt-2">
              {t('footerDesc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sidebar-foreground mb-4">{t('instituteName')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t('navHome')}
                </a>
              </li>
              <li>
                <a href="#courses" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t('navCourses')}
                </a>
              </li>
              <li>
                <a href="#register" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t('navRegister')}
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors">
                  {t('navContact')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="font-bold text-sidebar-foreground mb-4">{t('navContact')}</h4>
            <div className="flex flex-col gap-1.5 mb-5">
              {PHONES.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sidebar-foreground/70 hover:text-sidebar-primary transition-colors"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  {p}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4 mb-6">
              <a href="https://www.facebook.com/p.ymangay.shar?mibextid=wwXIfr&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/paimangay_shar?igsh=MTJoOHk3NWVuamdwaA==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-accent-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
            <Link href="/admin">
              <span className="text-sm text-sidebar-foreground/50 hover:text-sidebar-primary transition-colors cursor-pointer">
                {t('navAdmin')}
              </span>
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-sidebar-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-sidebar-foreground/60">
          <p>© {currentYear} {t('instituteName')}. {t('footerRights')}.</p>
        </div>
      </div>
    </footer>
  );
}
