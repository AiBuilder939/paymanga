import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  GraduationCap,
  BookOpen,
  Languages,
  School,
  Star,
  BookA,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type CourseDetail = { label: string; value: string };

type Course = {
  id: string;
  title: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
  details?: CourseDetail[];
};

const COURSES: Course[] = [
  {
    id: 'grade12',
    title: 'خولی پۆلی ١٢',
    icon: <GraduationCap className="w-7 h-7" />,
    accent: 'from-blue-500 to-indigo-600',
    iconBg: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500',
  },
  {
    id: 'grade10-11',
    title: 'خولی پۆلی ١٠ و ١١',
    icon: <BookOpen className="w-7 h-7" />,
    accent: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-500/10 text-violet-600 group-hover:bg-violet-500',
  },
  {
    id: 'language',
    title: 'خولی فێربوونی زمان',
    icon: <Languages className="w-7 h-7" />,
    accent: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500',
    details: [
      { label: 'ئاستەکان', value: 'منداڵان و گەورە' },
      { label: 'زمانەکان', value: 'ئینگلیزی، عەرەبی، تورکی، فارسی' },
    ],
  },
  {
    id: 'grades1-9',
    title: 'خولی وانەکانی قوتابخانە ١ بۆ ٩',
    icon: <School className="w-7 h-7" />,
    accent: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500',
    details: [
      { label: 'پۆلی ١-٣', value: 'بیرکاری، کوردی، ئینگلیزی' },
      { label: 'پۆلی ٤-٩', value: 'عەرەبی، ئینگلیزی، بیرکاری' },
    ],
  },
  {
    id: 'kindergarten',
    title: 'خولی ئامادەکاری بۆ قوتابخانە',
    icon: <Star className="w-7 h-7" />,
    accent: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500',
    details: [
      { label: 'ئاست', value: 'ڕەوزە' },
    ],
  },
  {
    id: 'kurdish-alphabet',
    title: 'خولی ئەلفوبێی کوردی',
    icon: <BookA className="w-7 h-7" />,
    accent: 'from-cyan-500 to-sky-600',
    iconBg: 'bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-500',
  },
  {
    id: 'visa',
    title: 'خولی ڤیزای هاوسەرگیری',
    icon: <Heart className="w-7 h-7" />,
    accent: 'from-fuchsia-500 to-pink-600',
    iconBg: 'bg-fuchsia-500/10 text-fuchsia-600 group-hover:bg-fuchsia-500',
  },
];

export function Courses() {
  const { dir } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <>
      <section
        id="courses"
        className="bg-background relative pt-28 pb-24 md:pt-36 md:pb-32"
      >
        <div className="container mx-auto px-4 md:px-6">

          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-1.5 bg-accent rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
              کۆرسەکانمان
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              کۆرسی گونجاو بۆ هەر ئاست و تەمەنێک — هەڵبژێرە و ئێستا دەست پێبکە
            </p>
          </div>

          {/* Cards grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
            dir={dir}
          >
            {COURSES.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col cursor-default transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: '0 2px 12px rgba(15,23,65,0.07)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 16px 48px -10px rgba(15,23,65,0.18), 0 2px 8px rgba(15,23,65,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 2px 12px rgba(15,23,65,0.07)';
                }}
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:text-white ${course.iconBg}`}
                >
                  {course.icon}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-foreground mb-3 leading-snug">
                  {course.title}
                </h3>

                {/* Optional detail badges */}
                {course.details && course.details.length > 0 && (
                  <div className="flex flex-col gap-2 mb-4">
                    {course.details.map((d) => (
                      <div key={d.label} className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                          {d.label}
                        </span>
                        <span className="text-sm text-foreground/80 font-medium leading-snug">
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Enroll button */}
                <Button
                  className="w-full mt-4 font-bold bg-primary/8 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  onClick={() => setSelectedCourse(course)}
                >
                  ناوتۆمارکردن
                </Button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Enrollment modal */}
      <Dialog
        open={!!selectedCourse}
        onOpenChange={(open) => { if (!open) setSelectedCourse(null); }}
      >
        <DialogContent className="sm:max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground">
              {selectedCourse?.title}
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
