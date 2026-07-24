import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Phone, MapPin, Clock, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { RegistrationInputLanguage, RegistrationInputShift } from '@workspace/api-client-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// ── Courses ──────────────────────────────────────────────────────────────────
const GRADE12_COURSES = [
  { id: 'chemistry',   ku: 'کیمیا',     ar: 'الكيمياء',          en: 'Chemistry'   },
  { id: 'physics',     ku: 'فیزیا',     ar: 'الفيزياء',          en: 'Physics'     },
  { id: 'biology',     ku: 'زیندەزانی', ar: 'الأحياء',           en: 'Biology'     },
  { id: 'math',        ku: 'بیرکاری',   ar: 'الرياضيات',         en: 'Mathematics' },
  { id: 'arabic-g12',  ku: 'عەرەبی',    ar: 'اللغة العربية',     en: 'Arabic'      },
  { id: 'english-g12', ku: 'ئینگلیزی',  ar: 'اللغة الإنجليزية',  en: 'English'     },
];

// ── Teacher map per course ────────────────────────────────────────────────────
const TEACHER_MAP: Record<string, string[]> = {
  chemistry:    ['م. ئیحسان ساڵح',        'م. بەهادین محەمەد'],
  physics:      ['م. سەربەست ڕۆستەم',     'م. بیلال بەکر'],
  biology:      ['م. ئاسۆ شەریف'],
  math:         ['م. بەختیار ئەحمەد',     'م. کاروان جەمال'],
  'arabic-g12': ['م. کامەران عەبدوڵا',    'م. هیلال سابیر'],
  'english-g12':['م. عەبدوڵا حەمەغەریب', 'م. بیلال ئەحمەد', 'م. ئاکام حسێن'],
};

// ── Success modal ─────────────────────────────────────────────────────────────
function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,17,40,0.70)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="relative bg-card rounded-3xl shadow-2xl border border-border max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 pt-10 pb-8 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30">
            <CheckCircle2 className="w-11 h-11 text-white" />
          </div>
          <h2 className="text-white font-black text-2xl text-center px-6 leading-snug">
            تۆمارکردنەکەت سەرکەوتوو بوو! 🎉
          </h2>
        </div>

        <div className="p-8 flex flex-col items-center gap-6 text-center">
          <p className="text-foreground font-semibold text-base leading-loose">
            زانیارییەکانت نێردران بۆ کارگێڕی پەیمانگای شار و لەماوەی{' '}
            <span className="text-primary font-black">٢٤ کاتژمێر</span>دا پەیوەندیت پێوە دەکەین.
          </p>
          <div className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            پەیمانگای شار — سەید صادق
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          </div>
          <Button onClick={onClose} className="w-full h-12 text-base font-bold rounded-xl">
            باشە، سوپاس
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function RegistrationForm() {
  const { t, lang, dir } = useLanguage();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const formSchema = z.object({
    studentName: z.string().min(2, {
      message: lang === 'ar' ? 'الاسم قصير جداً' : lang === 'en' ? 'Name is too short' : 'ناوەکەت زۆر کورتە',
    }),
    phoneNumber: z.string().min(7, {
      message: lang === 'ar' ? 'رقم الهاتف غير صحيح' : lang === 'en' ? 'Phone number is invalid' : 'ژمارەی تەلەفۆن دروست نییە',
    }),
    phone2: z.string().optional(),
    birthYear: z.string().optional(),
    address: z.string().optional(),
    courseId: z.string().min(1, {
      message: lang === 'ar' ? 'الرجاء اختيار الدورة' : lang === 'en' ? 'Please select a course' : 'تکایە کۆرسێک هەڵبژێرە',
    }),
    teacherName: z.string().optional(),
    shift: z.enum([RegistrationInputShift.morning, RegistrationInputShift.evening]),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { studentName: '', phoneNumber: '', phone2: '', birthYear: '', address: '', courseId: '', teacherName: '', shift: undefined, notes: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      // Bundle optional extra fields into metadata JSON
      const meta: Record<string, string> = {};
      if (values.phone2?.trim())     meta.phone2     = values.phone2.trim();
      if (values.birthYear?.trim())  meta.birthYear  = values.birthYear.trim();
      if (values.address?.trim())    meta.address    = values.address.trim();

      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName:  values.studentName,
          phoneNumber:  values.phoneNumber,
          courseId:     values.courseId,
          teacherName:  values.teacherName || null,
          shift:        values.shift,
          language:     lang as RegistrationInputLanguage,
          notes:        values.notes || null,
          metadata:     Object.keys(meta).length > 0 ? JSON.stringify(meta) : null,
        }),
      });
      if (!res.ok) throw new Error('Server error');
      setShowSuccess(true);
      form.reset();
      setSelectedCourse('');
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  const teacherOptions = selectedCourse ? (TEACHER_MAP[selectedCourse] ?? []) : [];

  return (
    <>
      <AnimatePresence>
        {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}
      </AnimatePresence>

      <section id="register" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto bg-card rounded-3xl shadow-xl overflow-hidden border border-border flex flex-col lg:flex-row">

            {/* Info Panel */}
            <div className="bg-primary p-10 lg:w-2/5 text-primary-foreground flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">{t('regTitle')}</h2>
                <p className="text-primary-foreground/80 leading-relaxed mb-12">{t('regSubtitle')}</p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white/90">سەید صادق</h4>
                      <p className="text-white/70 text-sm mt-1">{t('contactAddress')}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white/90">{t('contactPhone')}</h4>
                      <div className="flex flex-col gap-0.5 mt-1" dir="ltr">
                        <p className="text-white/70 text-sm">0750 119 6540</p>
                        <p className="text-white/70 text-sm">0770 762 3252</p>
                        <p className="text-white/70 text-sm">0750 185 8773</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white/90">کاتەکانی دەوام</h4>
                      <p className="text-white/70 text-sm mt-1">{t('contactHours')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Panel */}
            <div className="p-10 lg:w-3/5 bg-card">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir={dir}>

                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('regName')}</FormLabel>
                          <FormControl>
                            <Input placeholder={t('regName')} className="bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('regPhone')}</FormLabel>
                          <FormControl>
                            <Input placeholder="0750 xxx xxxx" className="bg-background text-left" dir="ltr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Course → Teacher → Shift (stacked in two columns) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Course */}
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('regCourse')}</FormLabel>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              setSelectedCourse(val);
                              form.setValue('teacherName', ''); // reset teacher when course changes
                            }}
                            value={field.value}
                            dir={dir}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder={t('regSelectCourse')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent dir={dir}>
                              {GRADE12_COURSES.map((course) => {
                                const name = lang === 'ku' ? course.ku : lang === 'ar' ? course.ar : course.en;
                                return <SelectItem key={course.id} value={course.id}>{name}</SelectItem>;
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Shift */}
                    <FormField
                      control={form.control}
                      name="shift"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('regShift')}</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} dir={dir}>
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder={t('regSelectShift')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent dir={dir}>
                              <SelectItem value={RegistrationInputShift.morning}>{t('regShiftMorning')}</SelectItem>
                              <SelectItem value={RegistrationInputShift.evening}>{t('regShiftEvening')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Teacher dropdown — full width, fades in once a course is chosen */}
                  <AnimatePresence>
                    {selectedCourse && teacherOptions.length > 0 && (
                      <motion.div
                        key={selectedCourse}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                      >
                        <FormField
                          control={form.control}
                          name="teacherName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {lang === 'ku' ? 'مامۆستا هەڵبژێرە' : lang === 'ar' ? 'اختر المدرس' : 'Select Teacher'}
                              </FormLabel>
                              <Select onValueChange={field.onChange} value={field.value ?? ''} dir={dir}>
                                <FormControl>
                                  <SelectTrigger className="bg-background">
                                    <SelectValue
                                      placeholder={
                                        lang === 'ku' ? '-- مامۆستا هەڵبژێرە --'
                                        : lang === 'ar' ? '-- اختر المدرس --'
                                        : '-- Select a Teacher --'
                                      }
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent dir={dir}>
                                  {teacherOptions.map((name) => (
                                    <SelectItem key={name} value={name}>{name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Extra info: second phone + birth year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {lang === 'ku' ? 'ژمارە مۆبایل ٢ (ئارەزوومەندانە)' : lang === 'ar' ? 'رقم الهاتف الثاني (اختياري)' : 'Second Phone (optional)'}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="0770 xxx xxxx" className="bg-background text-left" dir="ltr" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {lang === 'ku' ? 'ساڵی لەدایکبوون (ئارەزوومەندانە)' : lang === 'ar' ? 'سنة الميلاد (اختياري)' : 'Birth Year (optional)'}
                          </FormLabel>
                          <FormControl>
                            <Input placeholder={lang === 'ku' ? 'نموونە: ٢٠٠٥' : lang === 'ar' ? 'مثال: 2005' : 'e.g. 2005'} className="bg-background" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {lang === 'ku' ? 'ناونیشان (ئارەزوومەندانە)' : lang === 'ar' ? 'العنوان (اختياري)' : 'Address (optional)'}
                        </FormLabel>
                        <FormControl>
                          <Input placeholder={lang === 'ku' ? 'شار، شوێن...' : lang === 'ar' ? 'المدينة، الحي...' : 'City, area...'} className="bg-background" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('regNotes')}</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('regNotes')}
                            className="bg-background resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                      {t('regError')}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '...' : t('regSubmit')}
                  </Button>
                </form>
              </Form>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
