import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { FlaskConical, Atom, Sigma, Globe, BookText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GRADE12_SUBJECTS = [
  {
    id: 'chemistry',
    icon: <FlaskConical className="w-7 h-7" />,
    nameKu: 'کیمیا',
    nameAr: 'الكيمياء',
    nameEn: 'Chemistry',
    descKu: 'تێگەیشتنی قووڵ لە بابەتەکانی کیمیای پۆلی دوازدەم',
    descAr: 'فهم عميق لمواضيع الكيمياء للصف الثاني عشر',
    descEn: 'Deep understanding of Grade 12 Chemistry topics',
    iconBg: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500',
  },
  {
    id: 'physics',
    icon: <Atom className="w-7 h-7" />,
    nameKu: 'فیزیا',
    nameAr: 'الفيزياء',
    nameEn: 'Physics',
    descKu: 'تێگەیشتنی یاسا و تیۆریەکانی فیزیای پۆلی دوازدەم',
    descAr: 'فهم قوانين ونظريات الفيزياء للصف الثاني عشر',
    descEn: 'Understanding laws and theories of Grade 12 Physics',
    iconBg: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500',
  },
  {
    id: 'math',
    icon: <Sigma className="w-7 h-7" />,
    nameKu: 'بیرکاری',
    nameAr: 'الرياضيات',
    nameEn: 'Mathematics',
    descKu: 'تەمرین و شیکاری بابەتەکانی بیرکاری پۆلی دوازدەم',
    descAr: 'تمارين وتحليل مواضيع الرياضيات للصف الثاني عشر',
    descEn: 'Practice and analysis of Grade 12 Mathematics topics',
    iconBg: 'bg-violet-500/10 text-violet-600 group-hover:bg-violet-500',
  },
  {
    id: 'arabic-g12',
    icon: <BookText className="w-7 h-7" />,
    nameKu: 'عەرەبی',
    nameAr: 'اللغة العربية',
    nameEn: 'Arabic',
    descKu: 'ئامادەکاری بۆ تاقیکردنەوەی عەرەبی پۆلی دوازدەم',
    descAr: 'التحضير لامتحانات اللغة العربية للصف الثاني عشر',
    descEn: 'Preparation for Grade 12 Arabic language exams',
    iconBg: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500',
  },
  {
    id: 'english-g12',
    icon: <Globe className="w-7 h-7" />,
    nameKu: 'ئینگلیزی',
    nameAr: 'اللغة الإنجليزية',
    nameEn: 'English',
    descKu: 'ئامادەکاری بۆ تاقیکردنەوەی ئینگلیزی پۆلی دوازدەم',
    descAr: 'التحضير لامتحانات اللغة الإنجليزية للصف الثاني عشر',
    descEn: 'Preparation for Grade 12 English language exams',
    iconBg: 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500',
  },
];

export function Courses() {
  const { t, lang, dir } = useLanguage();

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="courses"
      className="bg-background relative pt-28 pb-24 md:pt-36 md:pb-32"
    >
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-1.5 bg-accent rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
            {t('grade12Title')}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('grade12Subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 md:gap-6" dir={dir}>
          {GRADE12_SUBJECTS.map((subject, index) => {
            const name = lang === 'ku' ? subject.nameKu : lang === 'ar' ? subject.nameAr : subject.nameEn;
            const desc = lang === 'ku' ? subject.descKu : lang === 'ar' ? subject.descAr : subject.descEn;

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.09 }}
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col cursor-default transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: '0 2px 12px rgba(15,23,65,0.07)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 16px 48px -10px rgba(15,23,65,0.20), 0 2px 8px rgba(15,23,65,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 2px 12px rgba(15,23,65,0.07)';
                }}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:text-white ${subject.iconBg}`}>
                  {subject.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 leading-snug">{name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">{desc}</p>
                <Button
                  className="w-full font-bold bg-primary/8 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  onClick={() => handleScroll('#register')}
                >
                  {t('enrollButton')}
                </Button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
