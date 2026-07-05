import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useListCourses } from '@workspace/api-client-react';
import { BookA, Monitor, Calculator, Palette, PenTool, BrainCircuit, Globe, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Courses() {
  const { t, lang, dir } = useLanguage();
  const { data: courses, isLoading } = useListCourses();

  // Helper to resolve icon from string
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'language': return <Globe className="w-8 h-8" />;
      case 'computer': return <Monitor className="w-8 h-8" />;
      case 'accounting': return <Calculator className="w-8 h-8" />;
      case 'design': return <Palette className="w-8 h-8" />;
      case 'arabic': return <BookA className="w-8 h-8" />;
      case 'development': return <BrainCircuit className="w-8 h-8" />;
      default: return <PenTool className="w-8 h-8" />;
    }
  };

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="courses" className="py-24 md:py-32 bg-background relative pt-48 md:pt-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-1 bg-accent rounded-full" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('coursesTitle')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('coursesSubtitle')}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 h-64 animate-pulse flex flex-col">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  key={course.id}
                  className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
                  dir={dir}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {getIcon(course.icon)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">{name}</h3>
                  <p className="text-muted-foreground mb-8 flex-1 leading-relaxed">{desc}</p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-border">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      {(course.enrolledCount ?? 0) > 0 && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Users className="w-3.5 h-3.5" />
                          <span>+{course.enrolledCount} {t('heroStats1Label')}</span>
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
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
