import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lang, t } from '../translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: 'rtl' | 'ltr';
  t: (key: keyof typeof t) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ku');
  const dir = lang === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang, dir]);

  const tHelper = (key: keyof typeof t) => {
    return t[key][lang];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir, t: tHelper }}>
      <div dir={dir} className={lang === 'en' ? 'font-en' : 'font-ku'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
