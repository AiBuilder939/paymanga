import { useLanguage } from '../contexts/LanguageContext';

type Teacher = {
  name: string;
  subject: string;
  subjectKey: string;
};

const TEACHERS: Teacher[] = [
  { name: 'م. لێهسان ساڵح',        subject: 'وانەی کیمیا',    subjectKey: 'chemistry' },
  { name: 'م. بەهادین محەمەد',     subject: 'وانەی کیمیا',    subjectKey: 'chemistry' },
  { name: 'م. ئاسۆ شەریف',         subject: 'وانەی زیندەزانی', subjectKey: 'biology' },
  { name: 'م. سەربەست ڕۆستەم',    subject: 'وانەی فیزیا',    subjectKey: 'physics' },
  { name: 'م. بیلال بەکر',         subject: 'وانەی فیزیا',    subjectKey: 'physics' },
  { name: 'م. کامەران عەبدوڵا',    subject: 'وانەی عەرەبی',   subjectKey: 'arabic' },
  { name: 'م. هێلال سابیر',        subject: 'وانەی عەرەبی',   subjectKey: 'arabic' },
  { name: 'م. بەختیار ئەحمەد',     subject: 'وانەی بیرکاری',  subjectKey: 'math' },
  { name: 'م. کەروان جەمال',       subject: 'وانەی بیرکاری',  subjectKey: 'math' },
  { name: 'م. عەبدوڵا حەمەغەریب', subject: 'وانەی ئینگلیزی', subjectKey: 'english' },
  { name: 'م. بیلال ئەحمەد',       subject: 'وانەی ئینگلیزی', subjectKey: 'english' },
  { name: 'م. ئاکام حسێن',         subject: 'وانەی ئینگلیزی', subjectKey: 'english' },
];

type SubjectStyle = {
  avatar: string;   // gradient for the avatar circle
  badge: string;    // badge background + text
  ring: string;     // ring color on hover
  dot: string;      // accent dot
};

const SUBJECT_STYLES: Record<string, SubjectStyle> = {
  chemistry: {
    avatar: 'from-emerald-400 to-teal-500',
    badge:  'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    ring:   'group-hover:ring-emerald-300 dark:group-hover:ring-emerald-700',
    dot:    'bg-emerald-400',
  },
  biology: {
    avatar: 'from-cyan-400 to-sky-500',
    badge:  'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300',
    ring:   'group-hover:ring-cyan-300 dark:group-hover:ring-cyan-700',
    dot:    'bg-cyan-400',
  },
  physics: {
    avatar: 'from-blue-400 to-indigo-500',
    badge:  'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    ring:   'group-hover:ring-blue-300 dark:group-hover:ring-blue-700',
    dot:    'bg-blue-400',
  },
  arabic: {
    avatar: 'from-violet-400 to-purple-500',
    badge:  'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    ring:   'group-hover:ring-violet-300 dark:group-hover:ring-violet-700',
    dot:    'bg-violet-400',
  },
  math: {
    avatar: 'from-amber-400 to-orange-500',
    badge:  'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    ring:   'group-hover:ring-amber-300 dark:group-hover:ring-amber-700',
    dot:    'bg-amber-400',
  },
  english: {
    avatar: 'from-rose-400 to-pink-500',
    badge:  'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    ring:   'group-hover:ring-rose-300 dark:group-hover:ring-rose-700',
    dot:    'bg-rose-400',
  },
};

function getInitials(name: string): string {
  // Extract up to two meaningful letters from the Kurdish name (skip م.)
  const parts = name.replace('م. ', '').trim().split(' ');
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return parts[0].slice(0, 2);
}

export function Staff() {
  const { dir } = useLanguage();

  return (
    <section className="py-20 bg-background relative overflow-hidden" dir={dir}>
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 start-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 end-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-1.5 bg-accent rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
            باشترین ستافی پۆلی ١٢
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            مامۆستایانی پسپۆڕ و بەteجربەی خوێندنی پۆلی دوازدەم، ئامادەن بۆ رێنماییکردنت بەرەو سەرکەوتن
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {TEACHERS.map((teacher) => {
            const style = SUBJECT_STYLES[teacher.subjectKey];
            const initials = getInitials(teacher.name);

            return (
              <div
                key={teacher.name}
                className={`
                  group relative bg-card border border-border rounded-2xl p-6 md:p-7
                  flex flex-col items-center text-center gap-4
                  shadow-sm hover:shadow-xl
                  transition-all duration-300 ease-out
                  hover:-translate-y-1.5
                  ring-2 ring-transparent ${style.ring}
                  cursor-default
                `}
              >
                {/* Subtle shimmer on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)' }}
                />

                {/* Avatar */}
                <div className="relative">
                  <div
                    className={`
                      w-20 h-20 md:w-24 md:h-24 rounded-full
                      bg-gradient-to-br ${style.avatar}
                      flex items-center justify-center
                      text-white font-black text-2xl md:text-3xl
                      shadow-lg
                      ring-4 ring-white dark:ring-card
                      transition-transform duration-300 group-hover:scale-105
                      select-none
                    `}
                  >
                    {initials}
                  </div>
                  {/* Online-style status dot */}
                  <span
                    className={`
                      absolute bottom-1 end-1 w-4 h-4 rounded-full ${style.dot}
                      ring-2 ring-white dark:ring-card
                    `}
                  />
                </div>

                {/* Name */}
                <div className="relative z-10 flex flex-col items-center gap-2.5 w-full">
                  <h3 className="font-black text-foreground text-[15px] md:text-base leading-snug">
                    {teacher.name}
                  </h3>

                  {/* Subject badge */}
                  <span
                    className={`
                      inline-flex items-center px-3 py-1 rounded-full
                      text-xs font-bold tracking-wide
                      ${style.badge}
                      border border-current/10
                    `}
                  >
                    {teacher.subject}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
