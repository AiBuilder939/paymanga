import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type StatusResult =
  | { status: 'approved'; studentName: string; courseName: string }
  | { status: 'pending'; studentName: string; courseName: string }
  | { status: 'not_found' }
  | null;

export function StatusCheck() {
  const { t, lang, dir } = useLanguage();
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<StatusResult>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setIsLoading(true);
    setResult(null);
    setHasError(false);

    try {
      const res = await fetch(`/api/registrations/status?phone=${encodeURIComponent(phone.trim())}`);
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      setResult(data);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-muted/40" dir={dir}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-1.5 bg-accent rounded-full" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {t('statusCheckTitle')}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t('statusCheckSubtitle')}
            </p>
          </div>

          {/* Search Card */}
          <div
            className="bg-card border border-border rounded-2xl p-6 md:p-8"
            style={{ boxShadow: '0 4px 24px -4px rgba(15,23,65,0.10)' }}
          >
            <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                  style={{ [dir === 'rtl' ? 'right' : 'left']: '14px' }}
                />
                <Input
                  type="tel"
                  dir="ltr"
                  placeholder="0750 xxx xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-background h-12 text-base"
                  style={{ paddingInlineStart: '40px' }}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-8 font-bold text-base shrink-0"
                disabled={isLoading || !phone.trim()}
              >
                {isLoading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : t('statusCheckBtn')
                }
              </Button>
            </form>

            {/* Result */}
            <AnimatePresence mode="wait">
              {hasError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="font-medium">{t('statusError')}</p>
                </motion.div>
              )}

              {result?.status === 'approved' && (
                <motion.div
                  key="approved"
                  initial={{ opacity: 0, scale: 0.97, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 rounded-2xl overflow-hidden"
                  style={{ boxShadow: '0 8px 32px -4px rgba(16,185,129,0.25)' }}
                >
                  {/* Gold/green banner */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-black text-xl leading-tight">
                        {lang === 'ku' ? 'پیرۆزە! 🎉' : lang === 'ar' ? 'مبروك! 🎉' : 'Congratulations! 🎉'}
                      </p>
                      {result.studentName && (
                        <p className="text-white/80 text-sm mt-0.5 font-medium">{result.studentName}</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-5">
                    <p className="text-emerald-800 dark:text-emerald-200 font-semibold leading-relaxed text-[15px]">
                      {t('statusApproved')}
                    </p>
                    {result.courseName && (
                      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-bold">
                        {result.courseName}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {result?.status === 'pending' && (
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-800"
                  style={{ boxShadow: '0 4px 20px -4px rgba(245,158,11,0.20)' }}
                >
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-bold mb-2 border border-amber-200 dark:border-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {lang === 'ku' ? 'لەژێر پێداچوونەوەدایە' : lang === 'ar' ? 'قيد المراجعة' : 'Under Review'}
                      </div>
                      <p className="text-amber-800 dark:text-amber-200 font-semibold leading-relaxed text-[15px]">
                        {t('statusPending')}
                      </p>
                      {result.studentName && (
                        <p className="text-amber-600 dark:text-amber-400 text-sm mt-1 font-medium">{result.studentName}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {result?.status === 'not_found' && (
                <motion.div
                  key="not-found"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-muted border border-border text-muted-foreground"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-muted-foreground" />
                  <p className="font-medium">{t('statusNotFound')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
