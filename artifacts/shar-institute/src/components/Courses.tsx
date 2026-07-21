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

/* ─── Types ─────────────────────────────────────────────── */

type CourseId =
  | 'grade12'
  | 'grade10-11'
  | 'language'
  | 'grades1-9'
  | 'kindergarten'
  | 'kurdish-alphabet'
  | 'visa';

type Course = {
  id: CourseId;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
};

/* ─── Course list ────────────────────────────────────────── */

const COURSES: Course[] = [
  {
    id: 'grade12',
    title: 'خولی پۆلی ١٢',
    icon: <GraduationCap className="w-7 h-7" />,
    iconBg: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500',
  },
  {
    id: 'grade10-11',
    title: 'خولی پۆلی ١٠ و ١١',
    icon: <BookOpen className="w-7 h-7" />,
    iconBg: 'bg-violet-500/10 text-violet-600 group-hover:bg-violet-500',
  },
  {
    id: 'language',
    title: 'خولی فێربوونی زمان',
    icon: <Languages className="w-7 h-7" />,
    iconBg: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500',
  },
  {
    id: 'grades1-9',
    title: 'خولی وانەکانی قوتابخانە ١ بۆ ٩',
    icon: <School className="w-7 h-7" />,
    iconBg: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500',
  },
  {
    id: 'kindergarten',
    title: 'خولی ئامادەکاری بۆ قوتابخانە (ئاستی ڕەوزە)',
    icon: <Star className="w-7 h-7" />,
    iconBg: 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500',
  },
  {
    id: 'kurdish-alphabet',
    title: 'خولی ئەلفوبێی کوردی',
    icon: <BookA className="w-7 h-7" />,
    iconBg: 'bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-500',
  },
  {
    id: 'visa',
    title: 'خولی ڤیزای هاوسەرگیری',
    icon: <Heart className="w-7 h-7" />,
    iconBg: 'bg-fuchsia-500/10 text-fuchsia-600 group-hover:bg-fuchsia-500',
  },
];

/* ─── Modals ─────────────────────────────────────────────── */

/** Generic pill-style toggle button */
function PillToggle({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
        selected
          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
          : 'bg-background text-foreground border-border hover:border-primary/50'
      }`}
    >
      {label}
    </button>
  );
}

/** Modal for "خولی فێربوونی زمان" */
function LanguageCourseModal() {
  const [level, setLevel] = useState<string | null>(null);
  const [lang, setLang] = useState<string | null>(null);

  const levels = ['ئاستی منداڵان', 'ئاستی گەورە'];
  const languages = ['زمانی ئینگلیزی', 'زمانی عەرەبی', 'زمانی تورکی', 'زمانی فارسی'];

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Level */}
      <div>
        <p className="text-sm font-bold text-foreground mb-3">ئاست</p>
        <div className="flex flex-wrap gap-2">
          {levels.map((l) => (
            <PillToggle
              key={l}
              label={l}
              selected={level === l}
              onClick={() => setLevel(level === l ? null : l)}
            />
          ))}
        </div>
      </div>

      {/* Language */}
      <div>
        <p className="text-sm font-bold text-foreground mb-3">زمان</p>
        <div className="flex flex-wrap gap-2">
          {languages.map((ln) => (
            <PillToggle
              key={ln}
              label={ln}
              selected={lang === ln}
              onClick={() => setLang(lang === ln ? null : ln)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Grade-range toggle for the 1-9 modal */
type GradeRange = '1-3' | '4-9' | null;

const SUBJECTS_1_3 = ['بیرکاری', 'کوردی', 'ئینگلیزی'];
const SUBJECTS_4_9 = ['عەرەبی', 'ئینگلیزی', 'بیرکاری'];

/** Modal for "خولی وانەکانی قوتابخانە ١ بۆ ٩" */
function Grades1to9Modal() {
  const [gradeRange, setGradeRange] = useState<GradeRange>(null);
  const [subject, setSubject] = useState<string | null>(null);

  const handleRangeChange = (range: GradeRange) => {
    setGradeRange(gradeRange === range ? null : range);
    setSubject(null); // reset subject when range changes
  };

  const subjects = gradeRange === '1-3' ? SUBJECTS_1_3 : gradeRange === '4-9' ? SUBJECTS_4_9 : [];

  return (
    <div className="flex flex-col gap-6 pt-2">
      {/* Grade range */}
      <div>
        <p className="text-sm font-bold text-foreground mb-3">پۆل</p>
        <div className="flex flex-wrap gap-2">
          <PillToggle
            label="پۆلەکانی ١ بۆ ٣"
            selected={gradeRange === '1-3'}
            onClick={() => handleRangeChange('1-3')}
          />
          <PillToggle
            label="پۆلەکانی ٤ بۆ ٩"
            selected={gradeRange === '4-9'}
            onClick={() => handleRangeChange('4-9')}
          />
        </div>
      </div>

      {/* Subjects — shown only after a range is selected */}
      {gradeRange && (
        <motion.div
          key={gradeRange}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <p className="text-sm font-bold text-foreground mb-3">بابەت</p>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <PillToggle
                key={s}
                label={s}
                selected={subject === s}
                onClick={() => setSubject(subject === s ? null : s)}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────── */

export function Courses() {
  const { dir } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openModal = (course: Course) => setSelectedCourse(course);
  const closeModal = () => setSelectedCourse(null);

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
                <h3 className="text-base font-bold text-foreground mb-4 leading-snug flex-1">
                  {course.title}
                </h3>

                {/* Enroll button */}
                <Button
                  className="w-full mt-auto font-bold bg-primary/8 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  onClick={() => openModal(course)}
                >
                  ناوتۆمارکردن
                </Button>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Enrollment modal */}
      <Dialog open={!!selectedCourse} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground leading-snug">
              {selectedCourse?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedCourse?.id === 'language' && <LanguageCourseModal />}
          {selectedCourse?.id === 'grades1-9' && <Grades1to9Modal />}
        </DialogContent>
      </Dialog>
    </>
  );
}
