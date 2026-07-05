import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { Lang } from '../translations';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { lang, setLang, t, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: t('navHome') },
    { href: '#courses', label: t('navCourses') },
    { href: '#register', label: t('navRegister') },
    { href: '#contact', label: t('navContact') },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    }
  };

  const languages: { code: Lang; label: string; flag: string }[] = [
    { code: 'ku', label: 'کوردی', flag: '🇹🇯' },
    { code: 'ar', label: 'العربية', flag: '🇮🇶' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const activeLang = languages.find((l) => l.code === lang) || languages[0];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              ش
            </div>
            <span className={`font-bold text-xl md:text-2xl tracking-tight ${scrolled ? 'text-foreground' : 'text-primary-foreground'}`}>
              {t('instituteName')}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-medium hover:text-accent transition-colors ${
                    scrolled ? 'text-foreground/80' : 'text-primary-foreground/90'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 ${scrolled ? 'text-foreground hover:bg-muted' : 'text-primary-foreground hover:bg-white/10 hover:text-primary-foreground'}`}
                >
                  <Globe className="w-4 h-4" />
                  <span>{activeLang.label}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-32">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`flex items-center gap-2 cursor-pointer ${lang === l.code ? 'bg-muted font-medium' : ''}`}
                    dir={l.code === 'en' ? 'ltr' : 'rtl'}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md transition-transform hover:-translate-y-0.5"
              onClick={() => {
                const el = document.querySelector('#register');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('heroCtaEnroll')}
            </Button>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`${scrolled ? 'text-foreground' : 'text-primary-foreground'}`}
              >
                <Globe className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((l) => (
                <DropdownMenuItem
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className="flex items-center gap-2 cursor-pointer"
                  dir={l.code === 'en' ? 'ltr' : 'rtl'}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className={`${scrolled ? 'text-foreground' : 'text-primary-foreground'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg py-4 px-4 md:hidden flex flex-col gap-4 animate-in slide-in-from-top-2">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block py-2 px-4 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/admin">
                <span className="block py-2 px-4 text-base font-medium text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer">
                  {t('navAdmin')}
                </span>
              </Link>
            </li>
          </ul>
          <Button 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => {
              setMobileMenuOpen(false);
              document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {t('heroCtaEnroll')}
          </Button>
        </div>
      )}
    </nav>
  );
}
