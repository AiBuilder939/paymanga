import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useLanguage } from '../contexts/LanguageContext';
import { Lang } from '../translations';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const { lang, setLang, t, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    // Set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home',     label: t('navHome') },
    { href: '#courses',  label: t('navCourses') },
    { href: '#register', label: t('navRegister') },
    { href: '#contact',  label: t('navContact') },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const languages: { code: Lang; label: string; flag: string }[] = [
    { code: 'ku', label: 'کوردی',    flag: '🇹🇯' },
    { code: 'ar', label: 'العربية', flag: '🇮🇶' },
    { code: 'en', label: 'English',  flag: '🇬🇧' },
  ];

  const activeLang = languages.find((l) => l.code === lang) ?? languages[0];

  return (
    <nav
      dir={dir}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-navbar ${
        scrolled
          ? 'bg-background/92 border-b border-border shadow-sm py-3'
          : 'bg-primary/85 border-b border-white/10 py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────── */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group select-none">
            {/* Logo mark */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform duration-200 ${
                scrolled
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
              }`}
              style={{ lineHeight: 1 }}
            >
              ش
            </div>
            {/* Institute name */}
            <span
              className={`font-black text-xl md:text-2xl leading-none transition-colors ${
                scrolled ? 'text-foreground' : 'text-white'
              }`}
            >
              {t('instituteName')}
            </span>
          </div>
        </Link>

        {/* ── Desktop Nav ──────────────────────────── */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-7">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-semibold transition-colors hover:text-accent relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-accent after:origin-center after:scale-x-0 hover:after:scale-x-100 after:transition-transform ${
                    scrolled ? 'text-foreground/80' : 'text-white/90'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            {/* Language picker */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-1.5 font-semibold ${
                    scrolled
                      ? 'text-foreground hover:bg-muted'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>{activeLang.label}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-32">
                {languages.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`flex items-center gap-2 cursor-pointer font-medium ${
                      lang === l.code ? 'bg-muted' : ''
                    }`}
                    dir={l.code === 'en' ? 'ltr' : 'rtl'}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enroll CTA */}
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold shadow-md hover:-translate-y-0.5 transition-all"
              onClick={() => document.querySelector('#register')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('heroCtaEnroll')}
            </Button>
          </div>
        </div>

        {/* ── Mobile Controls ──────────────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={scrolled ? 'text-foreground' : 'text-white'}
                aria-label="Change language"
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
            className={scrolled ? 'text-foreground' : 'text-white'}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-xl py-4 px-4 md:hidden flex flex-col gap-3 animate-in slide-in-from-top-2">
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center py-2.5 px-4 text-base font-semibold text-foreground hover:bg-muted rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link href="/admin">
                <span className="flex items-center py-2.5 px-4 text-base font-semibold text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer">
                  {t('navAdmin')}
                </span>
              </Link>
            </li>
          </ul>
          <Button
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold h-12"
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
