import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Phone, MapPin, Clock, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCreateRegistration, RegistrationInputLanguage, RegistrationInputShift } from '@workspace/api-client-react';

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
  { id: 'chemistry',   ku: 'کیمیا',       ar: 'الكيمياء',         en: 'Chemistry' },
  { id: 'physics',     ku: 'فیزیا',       ar: 'الفيزياء',         en: 'Physics' },
  { id: 'biology',     ku: 'زیندەزانی',   ar: 'الأحياء',          en: 'Biology' },
  { id: 'math',        ku: 'بیرکاری',     ar: 'الرياضيات',        en: 'Mathematics' },
  { id: 'arabic-g12',  ku: 'عەرەبی',      ar: 'اللغة العربية',    en: 'Arabic' },
  { id: 'english-g12', ku: 'ئینگلیزی',    ar: 'اللغة الإنجليزية', en: 'English' },
];

// ── Teacher map per course ────────────────────────────────────────────────────
type TeacherEntry = { name: string; subjectKey: string };

const TEACHER_MAP: Record<string, TeacherEntry[]> = {
  chemistry: [
    { name: 'م. ئیحسان ساڵح',        subjectKey: 'chemistry' },
    { name: 'م. بەهادین محەمەد',     subjectKey: 'chemistry' },
  ],
  physics: [
    { name: 'م. سەربەست ڕۆستەم',    subjectKey: 'physics' },
    { name: 'م. بیلال بەکر',         subjectKey: 'physics' },
  ],
  biology: [
    { name: 'م. ئاسۆ شەریف',         subjectKey: 'biology' },
  ],
  math: [
    { name: 'م. بەختیار ئەحمەد',     subjectKey: 'math' },
    { name: 'م. کاروان جەمال',       subjectKey: 'math' },
  ],
  'arabic-g12': [
    { name: 'م. کامەران عەبدوڵا',    subjectKey: 'arabic' },
    { name: 'م. هیلال سابیر',        subjectKey: 'arabic' },
  ],
  'english-g12': [
    { name: 'م. عەبدوڵا حەمەغەریب', subjectKey: 'english' },
    { name: 'م. بیلال ئەحمەد',       subjectKey: 'english' },
    { name: 'م. ئاکام حسێن',         subjectKey: 'english' },
  ],
};

// ── Subject colours ───────────────────────────────────────────────────────────
const SUBJECT_STYLE: Record<string, { avatar: string; badge: string }> = {
  chemistry: { avatar: 'from-emerald-400 to-teal-500',  badge: 'bg-emerald-100 text-emerald-800' },
  physics:   { avatar: 'from-blue-400 to-indigo-500',   badge: 'bg-blue-100 text-blue-800'       },
  biology:   { avatar: 'from-cyan-400 to-sky-500',      badge: 'bg-cyan-100 text-cyan-800'       },
  math:      { avatar: 'from-amber-400 to-orange-500',  badge: 'bg-amber-100 text-amber-800'     },
  arabic:    { avatar: 'from-violet-400 to-purple-500', badge: 'bg-violet-100 text-violet-800'   },
  english:   { avatar: 'from-rose-400 to-pink-500',     badge: 'bg-rose-100 text-rose-800'       },
};

function getInitials(name: string): string {
  const parts = name.replace('م. ', '').trim().split(' ');
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : parts[0].slice(0, 2);
}

// ── Mini teacher card ─────────────────────────────────────────────────────────
function TeacherMiniCard({ teacher }: { teacher: TeacherEntry }) {
  const style = SUBJECT_STYLE[teacher.subjectKey] ?? SUBJECT_STYLE.chemistry;
  return (
    <div className="flex items-center gap-2.5 bg-card border border-border rounded-xl px-3 py-2.5 shadow-sm">
      <div
        className={`w-9 h-9 rounded-full bg-gradient-to-br ${style.avatar} flex items-center justify-center text-white font-black text-sm shrink-0 select-none`}
      >
        {getInitials(teacher.name)}
      </div>
      <span className="font-bold text-foreground text-sm leading-tight">{teacher.name}</span>
    </div>
  );
}

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
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Green top banner */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 pt-10 pb-8 flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center ring-4 ring-white/30">
            <CheckCircle2 className="w-11 h-11 text-white" />
          </div>
          <h2 className="text-white font-black text-2xl text-center px-6 leading-snug">
            تۆمارکردنەکەت سەرکەوتوو بوو! 🎉
          </h2>
        </div>

        {/* Body */}
        <div className="p-8 flex flex-col items-center gap-6 text-center">
          <p className="text-foreground font-semibold text-base leading-loose">
            زانیارییەکانت نێردران بۆ کارگێڕی پەیمانگای شار و لەماوەی{' '}
            <span className="text-primary font-black">٢٤ کاتژمێر</span>دا پەیوەندیت پێوە دەکەین.
          </p>

          {/* Decorative dots */}
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
  const createRegistration = useCreateRegistration();
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const formSchema = z.object({
    studentName: z.string().min(2, {
      message: lang === 'ar' ? 'الاسم قصير جداً' : lang === 'en' ? 'Name is too short' : 'ناوەکەت زۆر کورتە',
    }),
    phoneNumber: z.string().min(7, {
      message: lang === 'ar' ? 'رقم الهاتف غير صحيح' : lang === 'en' ? 'Phone number is invalid' : 'ژمارەی تەلەفۆن دروست نییە',
    }),
    courseId: z.string().min(1, {
      message: lang === 'ar' ? 'الرجاء اختيار الدورة' : lang === 'en' ? 'Please select a course' : 'تکایە کۆرسێک هەڵبژێرە',
    }),
    shift: z.enum([RegistrationInputShift.morning, RegistrationInputShift.evening]),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { studentName: '', phoneNumber: '', courseId: '', shift: undefined, notes: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createRegistration.mutate(
      { data: { ...values, language: lang as RegistrationInputLanguage } },
      {
        onSuccess: () => {
          setShowSuccess(true);
          form.reset();
          setSelectedCourse('');
        },
      }
    );
  }

  const teachers = selectedCourse ? (TEACHER_MAP[selectedCourse] ?? []) : [];

  return (
    <>
      {/* ── Success modal ── */}
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
                      <p className="text-white/70 text-sm mt-1" dir="ltr">0750 123 4567</p>
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

                  {/* Course + Shift */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Course with teacher preview */}
                    <div className="flex flex-col gap-0">
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
                                  return (
                                    <SelectItem key={course.id} value={course.id}>{name}</SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Teacher preview cards */}
                      <AnimatePresence mode="wait">
                        {teachers.length > 0 && (
                          <motion.div
                            key={selectedCourse}
                            initial={{ opacity: 0, y: -6, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -4, height: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2.5 flex flex-col gap-2">
                              {teachers.map((teacher) => (
                                <TeacherMiniCard key={teacher.name} teacher={teacher} />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

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

                  {createRegistration.isError && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm font-medium">
                      {t('regError')}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={createRegistration.isPending}
                  >
                    {createRegistration.isPending ? '...' : t('regSubmit')}
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
