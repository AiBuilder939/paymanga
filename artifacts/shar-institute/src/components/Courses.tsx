import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useListCourses } from '@workspace/api-client-react';
import {
  BookOpen, Monitor, Calculator, Palette,
  Languages, Clock, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Courses() {
  const { t, lang, dir } = useLanguage();
  const { data: courses, isLoading } = useListCourses();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':   return <BookOpen   className="w-7 h-7" />;
      case 'Monitor':    return <Monitor    className="w-7 h-7" />;
      case 'Users':      return <Users      className="w-7 h-7" />;
      case 'Calculator': return <Calculator className="w-7 h-7" />;
      case 'Palette':    return <Palette    className="w-7 h-7" />;
      case 'Languages':  return <Languages  className="w-7 h-7" />;
      default:           return <BookOpen   className="w-7 h-7" />;
    }
  };

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="courses"
      className="bg-background relative pt-28 pb-24 md:pt-36 md:pb-32"
    >
      <div className="container mx-auto px-4 md:px-6">

        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-1.5 bg-accent rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4 tracking-tight">
            {t('coursesTitle')}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('coursesSubtitle')}
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-6 h-64 animate-pulse flex flex-col"
              >
                <div className="w-14 h-14 bg-muted rounded-xl mb-4" />
                <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                <div className="h-4 bg-muted rounded w-full mb-2" />
                <div className="h-4 bg-muted rounded w-5/6 mb-6" />
                <div className="mt-auto flex justify-between">
                  <div className="h-6 bg-muted rounded w-1/3" />
                  <div className="h-10 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses?.map((course, index) => {
              const name = lang === 'ku' ? course.nameKu : lang === 'ar' ? course.nameAr : course.nameEn;
              const desc = lang === 'ku' ? course.descriptionKu : lang === 'ar' ? course.descriptionAr : course.descriptionEn;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  dir={dir}
                  className="group bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col cursor-default transition-all duration-300 hover:-translate-y-1.5"
                  style={{ boxShadow: '0 2px 12px rgba(15,23,65,0.07)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 12px 40px -8px rgba(15,23,65,0.18), 0 2px 8px rgba(15,23,65,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      '0 2px 12px rgba(15,23,65,0.07)';
                  }}
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/8 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {getIcon(course.icon)}
                  </div>

                  {/* Name */}
                  <h3 className="text-xl font-bold text-foreground mb-3 leading-snug">{name}</h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-8 flex-1 leading-relaxed text-[15px]">{desc}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-5 border-t border-border">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{course.duration}</span>
                      </div>
                      {(course.enrolledCount ?? 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="w-3.5 h-3.5 shrink-0" />
                          <span>+{course.enrolledCount} {t('heroStats1Label')}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      className="border-primary/40 text-primary font-semibold hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      onClick={() => handleScroll('#register')}
                    >
                      {t('enrollButton')}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
