import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQueryClient } from '@tanstack/react-query';
import {
  useListRegistrations,
  useGetRegistrationStats,
  useAdminLogin,
  useAdminLogout,
  getListRegistrationsQueryKey,
  getGetRegistrationStatsQueryKey,
  setAuthTokenGetter,
} from '@workspace/api-client-react';
import { useLanguage } from '../contexts/LanguageContext';
import { format } from 'date-fns';
import {
  Lock, ArrowLeft, LogOut,
  Download, Filter,
  Users, Sun, Moon, CalendarDays, BookOpen,
  CheckCircle2, Loader2, Info
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Extended type includes the status field returned by the API
type RegWithStatus = {
  id: number;
  studentName: string;
  phoneNumber: string;
  courseId: string;
  courseName: string;
  shift: 'morning' | 'evening';
  language: 'ku' | 'ar' | 'en';
  notes?: string | null;
  submittedAt: Date;
  status: 'pending' | 'approved';
  teacherName?: string | null;
  metadata?: string | null;
};

const META_LABELS: Record<string, string> = {
  phone2:        'ژمارە مۆبایل ٢',
  amadayy:       'ئامادەیی',
  bash:          'بەش',
  shwen:         'شوێن',
  ragaz:         'ڕەگەز',
  subjects:      'بابەتەکان',
  birthYear:     'ساڵی لەدایکبوون',
  grade:         'پۆل',
  guardianPhone: 'ژمارە سەرپەرشتیار',
  fatherPhone:   'ژمارە باوک',
  address:       'ناونیشان',
  school:        'قوتابخانە',
  subject:       'بابەت',
  level:         'ئاست',
  lang:          'زمان',
  tookCourse:    'پێشتر کۆرسی خوێندووە',
  prevCourse:    'کۆرسی پێشوو',
  foodAllergy:   'هەستیاری خواردن',
  fruitAllergy:  'هەستیاری میوە',
  transport:     'هاتووچۆ',
  studentPhone:  'ژمارە قوتابی',
};

const GRADE12_COURSES = [
  { id: 'chemistry',   ku: 'کیمیا',    ar: 'الكيمياء',         en: 'Chemistry' },
  { id: 'physics',     ku: 'فیزیا',    ar: 'الفيزياء',         en: 'Physics' },
  { id: 'math',        ku: 'بیرکاری',  ar: 'الرياضيات',        en: 'Mathematics' },
  { id: 'arabic-g12',  ku: 'عەرەبی',   ar: 'اللغة العربية',    en: 'Arabic' },
  { id: 'english-g12', ku: 'ئینگلیزی', ar: 'اللغة الإنجليزية', en: 'English' },
];

export default function Admin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { t, lang, dir } = useLanguage();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [shiftFilter, setShiftFilter] = useState<string>('all');
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [detailsReg, setDetailsReg] = useState<RegWithStatus | null>(null);

  const adminLogin = useAdminLogin();
  const adminLogout = useAdminLogout();
  const isAuthenticated = !!token;

  const { data: registrationsRaw, isLoading: loadingRegs } = useListRegistrations(
    {
      courseId: courseFilter !== 'all' ? courseFilter : undefined,
      shift: shiftFilter !== 'all' ? (shiftFilter as 'morning' | 'evening') : undefined,
    },
    {
      query: {
        enabled: isAuthenticated,
        retry: false,
        queryKey: getListRegistrationsQueryKey({
          courseId: courseFilter !== 'all' ? courseFilter : undefined,
          shift: shiftFilter !== 'all' ? (shiftFilter as 'morning' | 'evening') : undefined,
        }),
      }
    }
  );
  const registrations = registrationsRaw as unknown as RegWithStatus[] | undefined;

  const { data: stats } = useGetRegistrationStats(
    { query: { enabled: isAuthenticated, retry: false, queryKey: getGetRegistrationStatsQueryKey() } }
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoginError('');
    adminLogin.mutate(
      { data: { password } },
      {
        onSuccess: (res) => {
          setToken(res.token);
          setAuthTokenGetter(() => res.token);
          queryClient.invalidateQueries();
        },
        onError: (err: { status?: number }) => {
          if (err?.status === 429) setLoginError(t('adminRateLimit'));
          else setLoginError(t('adminLoginError'));
          setPassword('');
        },
      }
    );
  };

  const handleLogout = () => {
    adminLogout.mutate();
    setAuthTokenGetter(null);
    setToken(null);
    setPassword('');
    queryClient.clear();
  };

  const handleApprove = async (id: number) => {
    if (!token) return;
    setApprovingId(id);
    try {
      await fetch(`/api/registrations/${id}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      queryClient.invalidateQueries({
        queryKey: getListRegistrationsQueryKey({
          courseId: courseFilter !== 'all' ? courseFilter : undefined,
          shift: shiftFilter !== 'all' ? (shiftFilter as 'morning' | 'evening') : undefined,
        }),
      });
    } finally {
      setApprovingId(null);
    }
  };

  const courseName = (c: typeof GRADE12_COURSES[0]) =>
    lang === 'ku' ? c.ku : lang === 'ar' ? c.ar : c.en;

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4" dir={dir}>
        <div className="max-w-md w-full bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="p-8 text-center bg-primary">
            <div className="w-16 h-16 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white">{t('adminLoginTitle')}</h2>
            <p className="text-primary-foreground/70 mt-2">{t('adminLoginSubtitle')}</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder={t('adminPassword')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-center text-lg"
                  autoFocus
                  disabled={adminLogin.isPending}
                />
                {loginError && (
                  <p className="text-destructive text-sm text-center font-medium">{loginError}</p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full h-12 text-base font-bold" disabled={adminLogin.isPending}>
                  {adminLogin.isPending ? t('adminVerifying') : t('adminLoginBtn')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setLocation('/')}
                  className="w-full h-12 gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('adminBack')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-black text-sm">ش</div>
            <h1 className="font-black text-xl">{t('adminTitle')}</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-4 h-4" />
            {t('adminLogout')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: t('adminTotalRegs'),   value: stats?.totalRegistrations ?? 0, icon: Users,       color: 'bg-blue-100 text-blue-600' },
            { label: t('adminMorningShift'), value: stats?.morningCount ?? 0,       icon: Sun,         color: 'bg-amber-100 text-amber-600' },
            { label: t('adminEveningShift'), value: stats?.eveningCount ?? 0,        icon: Moon,        color: 'bg-indigo-100 text-indigo-600' },
            { label: t('adminLast7Days'),    value: stats?.recentRegistrations ?? 0, icon: CalendarDays, color: 'bg-emerald-100 text-emerald-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{label}</p>
                <h3 className="text-2xl font-black">{value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Registrations Table */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                {t('adminRegistrations')}
              </h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-0.5 rounded-full">
                {registrations?.length ?? 0}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <Select value={courseFilter} onValueChange={setCourseFilter} dir={dir}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-background">
                    <SelectValue placeholder={t('adminAllCourses')} />
                  </SelectTrigger>
                  <SelectContent dir={dir}>
                    <SelectItem value="all">{t('adminAllCourses')}</SelectItem>
                    {GRADE12_COURSES.map(c => (
                      <SelectItem key={c.id} value={c.id}>{courseName(c)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Select value={shiftFilter} onValueChange={setShiftFilter} dir={dir}>
                <SelectTrigger className="w-full sm:w-[140px] bg-background">
                  <SelectValue placeholder={t('adminAllShifts')} />
                </SelectTrigger>
                <SelectContent dir={dir}>
                  <SelectItem value="all">{t('adminAllShifts')}</SelectItem>
                  <SelectItem value="morning">{t('adminMorningLabel')}</SelectItem>
                  <SelectItem value="evening">{t('adminEveningLabel')}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" title="Export" className="shrink-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table dir={dir}>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[50px] text-start">{t('adminColNum')}</TableHead>
                  <TableHead className="text-start">{t('adminColName')}</TableHead>
                  <TableHead className="text-start">{t('adminColPhone')}</TableHead>
                  <TableHead className="text-start">{t('adminColCourse')}</TableHead>
                  <TableHead className="text-start">مامۆستا</TableHead>
                  <TableHead className="text-start">{t('adminColShift')}</TableHead>
                  <TableHead className="text-start">{t('adminColLang')}</TableHead>
                  <TableHead className="text-start">{t('adminColDate')}</TableHead>
                  <TableHead className="text-start">{t('adminColStatus')}</TableHead>
                  <TableHead className="text-start">{t('adminColActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingRegs ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        {t('adminLoading')}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : registrations && registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <TableRow key={reg.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-muted-foreground text-start">{reg.id}</TableCell>

                      <TableCell className="font-semibold text-start">{reg.studentName}</TableCell>

                      <TableCell className="text-start">
                        <span className="font-mono text-sm" dir="ltr">{reg.phoneNumber}</span>
                      </TableCell>

                      <TableCell className="text-start">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold">
                          {reg.courseName}
                        </span>
                      </TableCell>

                      <TableCell className="text-start">
                        <span className="text-sm font-semibold text-foreground">
                          {reg.teacherName ?? <span className="text-muted-foreground">—</span>}
                        </span>
                      </TableCell>

                      <TableCell className="text-start">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                          reg.shift === 'morning'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                        }`}>
                          {reg.shift === 'morning' ? t('adminMorningLabel') : t('adminEveningLabel')}
                        </span>
                      </TableCell>

                      <TableCell className="text-start">
                        <span className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">
                          {reg.language === 'ku' ? t('adminLangKu') : reg.language === 'ar' ? t('adminLangAr') : t('adminLangEn')}
                        </span>
                      </TableCell>

                      <TableCell className="text-start text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(reg.submittedAt), 'MMM dd, yyyy HH:mm')}
                      </TableCell>

                      <TableCell className="text-start">
                        {reg.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700">
                            <CheckCircle2 className="w-3 h-3" />
                            {t('adminApproved')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            {t('adminPending')}
                          </span>
                        )}
                      </TableCell>

                      <TableCell className="text-start">
                        <div className="flex items-center gap-2">
                          {reg.status !== 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs font-bold border-emerald-400 text-emerald-700 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 transition-colors dark:border-emerald-700 dark:text-emerald-400"
                              disabled={approvingId === reg.id}
                              onClick={() => handleApprove(reg.id)}
                            >
                              {approvingId === reg.id
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : t('adminApprove')
                              }
                            </Button>
                          )}
                          {reg.metadata && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                              title="تایبەتمەندیەکان"
                              onClick={() => setDetailsReg(reg)}
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                      {t('adminEmpty')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {/* Metadata details dialog */}
      <Dialog open={!!detailsReg} onOpenChange={(open) => { if (!open) setDetailsReg(null); }}>
        <DialogContent className="sm:max-w-md" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-lg font-black">
              {detailsReg?.studentName} — {detailsReg?.courseName}
            </DialogTitle>
          </DialogHeader>
          {detailsReg?.metadata && (() => {
            let parsed: Record<string, unknown> = {};
            try { parsed = JSON.parse(detailsReg.metadata); } catch { /* noop */ }
            const entries = Object.entries(parsed).filter(([, v]) => v !== null && v !== undefined && v !== '');
            return (
              <div className="flex flex-col gap-3 pt-2 max-h-[60vh] overflow-y-auto pr-1">
                {entries.map(([key, val]) => (
                  <div key={key} className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
                    <span className="text-sm font-bold text-muted-foreground shrink-0">
                      {META_LABELS[key] ?? key}
                    </span>
                    <span className="text-sm text-foreground text-end">
                      {Array.isArray(val) ? val.join('، ') : String(val)}
                    </span>
                  </div>
                ))}
                {detailsReg.notes && (
                  <div className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0">
                    <span className="text-sm font-bold text-muted-foreground shrink-0">تێبینی</span>
                    <span className="text-sm text-foreground text-end">{detailsReg.notes}</span>
                  </div>
                )}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
