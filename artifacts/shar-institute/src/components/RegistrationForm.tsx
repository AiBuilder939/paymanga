import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Phone, MapPin, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCreateRegistration, RegistrationInputLanguage, RegistrationInputShift } from '@workspace/api-client-react';

const GRADE12_COURSES = [
  { id: 'chemistry',   ku: 'کیمیا',    ar: 'الكيمياء',         en: 'Chemistry' },
  { id: 'physics',     ku: 'فیزیا',    ar: 'الفيزياء',         en: 'Physics' },
  { id: 'math',        ku: 'بیرکاری',  ar: 'الرياضيات',        en: 'Mathematics' },
  { id: 'arabic-g12',  ku: 'عەرەبی',   ar: 'اللغة العربية',    en: 'Arabic' },
  { id: 'english-g12', ku: 'ئینگلیزی', ar: 'اللغة الإنجليزية', en: 'English' },
];

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

export function RegistrationForm() {
  const { t, lang, dir } = useLanguage();
  const createRegistration = useCreateRegistration();
  const [isSuccess, setIsSuccess] = useState(false);

  const formSchema = z.object({
    studentName: z.string().min(2, { message: lang === 'ar' ? 'الاسم قصير جداً' : lang === 'en' ? 'Name is too short' : 'ناوەکەت زۆر کورتە' }),
    phoneNumber: z.string().min(7, { message: lang === 'ar' ? 'رقم الهاتف غير صحيح' : lang === 'en' ? 'Phone number is invalid' : 'ژمارەی تەلەفۆن دروست نییە' }),
    courseId: z.string().min(1, { message: lang === 'ar' ? 'الرجاء اختيار الدورة' : lang === 'en' ? 'Please select a course' : 'تکایە کۆرسێک هەڵبژێرە' }),
    shift: z.enum([RegistrationInputShift.morning, RegistrationInputShift.evening]),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: "",
      phoneNumber: "",
      courseId: "",
      shift: undefined,
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createRegistration.mutate({
      data: {
        ...values,
        language: lang as RegistrationInputLanguage,
      }
    }, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        setTimeout(() => {
          setIsSuccess(false);
        }, 5000);
      }
    });
  }

  return (
    <section id="register" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto bg-card rounded-3xl shadow-xl overflow-hidden border border-border flex flex-col lg:flex-row">
          
          {/* Info Panel */}
          <div className="bg-primary p-10 lg:w-2/5 text-primary-foreground flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">{t('regTitle')}</h2>
              <p className="text-primary-foreground/80 leading-relaxed mb-12">
                {t('regSubtitle')}
              </p>
              
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
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">{t('regSuccess')}</h3>
                <Button 
                  variant="outline" 
                  onClick={() => setIsSuccess(false)}
                  className="mt-6"
                >
                  تۆمارکردنێکی تر
                </Button>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir={dir}>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="courseId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('regCourse')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} dir={dir}>
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder={t('regSelectCourse')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent dir={dir}>
                              {GRADE12_COURSES.map(course => {
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
                    
                    <FormField
                      control={form.control}
                      name="shift"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('regShift')}</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} dir={dir}>
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
                    {createRegistration.isPending ? "..." : t('regSubmit')}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
