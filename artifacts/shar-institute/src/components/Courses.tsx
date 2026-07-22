import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  GraduationCap, BookOpen, Languages, School, Star, BookA, Heart,
  Loader2, CheckCircle2,
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
  | 'grade12' | 'grade10-11' | 'language' | 'grades1-9'
  | 'kindergarten' | 'kurdish-alphabet' | 'visa';

type Course = {
  id: CourseId;
  title: string;
  icon: React.ReactNode;
  iconBg: string;
};

type ModalProps = { course: Course; onClose: () => void };

/* ─── Course list ────────────────────────────────────────── */

const COURSES: Course[] = [
  { id: 'grade12',          title: 'خولی پۆلی ١٢',                                    icon: <GraduationCap className="w-7 h-7" />, iconBg: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500' },
  { id: 'grade10-11',       title: 'خولی پۆلی ١٠ و ١١',                               icon: <BookOpen       className="w-7 h-7" />, iconBg: 'bg-violet-500/10 text-violet-600 group-hover:bg-violet-500' },
  { id: 'language',         title: 'خولی فێربوونی زمان',                               icon: <Languages      className="w-7 h-7" />, iconBg: 'bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500' },
  { id: 'grades1-9',        title: 'خولی وانەکانی قوتابخانە ١ بۆ ٩',                  icon: <School         className="w-7 h-7" />, iconBg: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500' },
  { id: 'kindergarten',     title: 'خولی ئامادەکاری بۆ قوتابخانە (ئاستی ڕەوزە)',       icon: <Star           className="w-7 h-7" />, iconBg: 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500' },
  { id: 'kurdish-alphabet', title: 'خولی ئەلفوبێی کوردی',                              icon: <BookA          className="w-7 h-7" />, iconBg: 'bg-cyan-500/10 text-cyan-600 group-hover:bg-cyan-500' },
  { id: 'visa',             title: 'خولی ڤیزای هاوسەرگیری',                            icon: <Heart          className="w-7 h-7" />, iconBg: 'bg-fuchsia-500/10 text-fuchsia-600 group-hover:bg-fuchsia-500' },
];

/* ─── Shared API helper ──────────────────────────────────── */

async function postRegistration(body: {
  studentName: string;
  phoneNumber: string;
  courseId: string;
  teacherName?: string | null;
  notes?: string | null;
  metadata: Record<string, unknown>;
}): Promise<void> {
  const res = await fetch('/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: body.studentName,
      phoneNumber: body.phoneNumber,
      courseId: body.courseId,
      shift: 'morning',
      language: 'ku',
      notes: body.notes ?? null,
      teacherName: body.teacherName ?? null,
      metadata: JSON.stringify(body.metadata),
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error ?? 'خەتا');
  }
}

/* ─── Shared UI primitives ───────────────────────────────── */

function PillToggle({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
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

function FormField({
  label, type = 'text', value, onChange, placeholder = '',
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-bold text-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
      />
    </div>
  );
}

function RadioGroup({
  label, name, options, value, onChange,
}: {
  label: string; name: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold text-foreground">{label}</p>
      <div className="flex flex-wrap gap-5">
        {options.map((o) => (
          <label key={o.value} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio" name={name} value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="accent-primary w-4 h-4"
            />
            <span className="text-sm text-foreground">{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ─── Shared submit helpers ──────────────────────────────── */

function SuccessScreen({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-black text-foreground">تۆمارکردن سەرکەوتوو بوو!</h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        زانیارییەکانت وەرگیراوە. بەم زووانە پەیوەندیت پێوە دەکەین.
      </p>
    </div>
  );
}

function SubmitSection({
  isValid, isSubmitting, error, onSubmit,
}: {
  isValid: boolean; isSubmitting: boolean; error: string; onSubmit: () => void;
}) {
  return (
    <div className="pt-3 mt-2 flex flex-col gap-2 border-t border-border">
      {error && (
        <p className="text-sm text-destructive text-center font-medium rounded-lg bg-destructive/10 px-3 py-2">
          {error}
        </p>
      )}
      <Button
        className="w-full h-11 font-bold text-base"
        disabled={!isValid || isSubmitting}
        onClick={onSubmit}
      >
        {isSubmitting
          ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />چاوەڕوانبە...</span>
          : 'ناردن'}
      </Button>
    </div>
  );
}

/* ─── Grade 12 modal ─────────────────────────────────────── */

const GRADE12_SUBJECTS = ['بیرکاری', 'کیمیا', 'فیزیا', 'زیندەزانی', 'ئینگلیزی', 'عەرەبی'];

const GRADE12_TEACHERS: Record<string, string[]> = {
  'بیرکاری':  ['م. کەیوان جەمال', 'م. بەختیار ئەحمەد'],
  'عەرەبی':   ['م. کامەران عبدالله', 'م. هیلال صابر'],
  'کیمیا':    ['م. ئیسحان صالح', 'م. بهادین محمد'],
  'زیندەزانی':['م. ئاسۆ شەریف'],
  'فیزیا':    ['م. سەربەست ڕۆستەم', 'م. بیلال بەکر'],
  'ئینگلیزی': ['م. ئاکام حسین', 'م. بیلال ئەحمەد', 'م. عبدالله حەمەغریب'],
};

function Grade12Modal({ course, onClose }: ModalProps) {
  const [fullName, setFullName]   = useState('');
  const [phone1, setPhone1]       = useState('');
  const [phone2, setPhone2]       = useState('');
  const [amadayy, setAmadayy]     = useState('');
  const [bash, setBash]           = useState<string | null>(null);
  const [shwen, setShwen]         = useState<string | null>(null);
  const [ragaz, setRagaz]         = useState<string | null>(null);
  const [subjects, setSubjects]   = useState<string[]>([]);
  const [teachers, setTeachers]   = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleSubject = (s: string) => {
    setSubjects((p) => {
      const next = p.includes(s) ? p.filter((x) => x !== s) : [...p, s];
      if (!next.includes(s)) {
        setTeachers((t) => { const c = { ...t }; delete c[s]; return c; });
      }
      return next;
    });
  };

  const setSubjectTeacher = (subject: string, teacher: string) =>
    setTeachers((t) => ({ ...t, [subject]: teacher }));

  const isValid =
    fullName.trim() !== '' && phone1.trim() !== '' && phone2.trim() !== '' &&
    amadayy.trim() !== '' && bash !== null && shwen !== null && ragaz !== null &&
    subjects.length > 0 && subjects.every((s) => teachers[s]?.trim());

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await postRegistration({
        studentName: fullName, phoneNumber: phone1, courseId: course.id,
        metadata: { phone2, amadayy, bash, shwen, ragaz, subjects, teachers },
      });
      setSubmitSuccess(true);
    } catch { setSubmitError('کێشەیەک هەیە، دووبارە هەوڵبدەرەوە'); }
    finally { setIsSubmitting(false); }
  };

  if (submitSuccess) return <SuccessScreen onClose={onClose} />;
  return (
    <>
      <div className="flex flex-col gap-5 pt-2 max-h-[55vh] overflow-y-auto pr-1">
        <FormField label="ناوی سیانی"      value={fullName} onChange={setFullName} />
        <FormField label="ژمارە مۆبایل ١" type="tel" value={phone1} onChange={setPhone1} placeholder="07..." />
        <FormField label="ژمارە مۆبایل ٢" type="tel" value={phone2} onChange={setPhone2} placeholder="07..." />
        <FormField label="ئامادەیی"        value={amadayy}  onChange={setAmadayy} />
        <div className="border-t border-border" />
        <RadioGroup label="بەش"   name="g12bash"   options={[{ value: 'زانستی', label: 'زانستی' }, { value: 'وێژەیی', label: 'وێژەیی' }]} value={bash} onChange={setBash} />
        <RadioGroup label="شوێن"  name="g12shwen"  options={[{ value: 'ناو شار', label: 'ناو شار' }, { value: 'دەرەوەی شار', label: 'دەرەوەی شار' }]} value={shwen} onChange={setShwen} />
        <RadioGroup label="ڕەگەز" name="g12ragaz"  options={[{ value: 'نێر', label: 'نێر' }, { value: 'مێ', label: 'مێ' }]} value={ragaz} onChange={setRagaz} />
        <div className="border-t border-border" />
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-foreground">بەشداری وانەکان</p>
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {GRADE12_SUBJECTS.map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={subjects.includes(s)} onChange={() => toggleSubject(s)} className="accent-primary w-4 h-4 rounded" />
                <span className="text-sm text-foreground">{s}</span>
              </label>
            ))}
          </div>
        </div>
        {subjects.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="text-sm font-bold text-foreground">هەڵبژاردنی مامۆستا</p>
            {subjects.map((s) => (
              <div key={s} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-muted-foreground">{s}</label>
                <select
                  value={teachers[s] ?? ''}
                  onChange={(e) => setSubjectTeacher(s, e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  dir="rtl"
                >
                  <option value="">مامۆستا هەڵبژێرە...</option>
                  {(GRADE12_TEACHERS[s] ?? []).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
      <SubmitSection isValid={isValid} isSubmitting={isSubmitting} error={submitError} onSubmit={handleSubmit} />
    </>
  );
}

/* ─── Grade 10-11 modal ──────────────────────────────────── */

function Grade1011Modal({ course, onClose }: ModalProps) {
  const [fullName, setFullName]             = useState('');
  const [birthYear, setBirthYear]           = useState('');
  const [grade, setGrade]                   = useState('');
  const [bash, setBash]                     = useState<string | null>(null);
  const [amadayy, setAmadayy]               = useState('');
  const [studentPhone, setStudentPhone]     = useState('');
  const [guardianPhone, setGuardianPhone]   = useState('');
  const [address, setAddress]               = useState('');
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [submitError, setSubmitError]       = useState('');
  const [submitSuccess, setSubmitSuccess]   = useState(false);

  const isValid =
    fullName.trim() !== '' && birthYear.trim() !== '' && grade !== '' &&
    bash !== null && amadayy.trim() !== '' && studentPhone.trim() !== '' &&
    guardianPhone.trim() !== '' && address.trim() !== '';

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await postRegistration({
        studentName: fullName, phoneNumber: studentPhone, courseId: course.id,
        metadata: { birthYear, grade, bash, amadayy, guardianPhone, address },
      });
      setSubmitSuccess(true);
    } catch { setSubmitError('کێشەیەک هەیە، دووبارە هەوڵبدەرەوە'); }
    finally { setIsSubmitting(false); }
  };

  if (submitSuccess) return <SuccessScreen onClose={onClose} />;
  return (
    <>
      <div className="flex flex-col gap-5 pt-2 max-h-[55vh] overflow-y-auto pr-1">
        <FormField label="ناوی سیانی"      value={fullName}  onChange={setFullName} />
        <FormField label="ساڵی لەدایکبوون" type="number" value={birthYear} onChange={setBirthYear} placeholder="٢٠٠٨" />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-foreground">پۆل</label>
          <select value={grade} onChange={(e) => setGrade(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
            <option value="">— هەڵبژێرە —</option>
            <option value="10">پۆلی ١٠</option>
            <option value="11">پۆلی ١١</option>
          </select>
        </div>
        <RadioGroup label="بەش" name="g1011bash" options={[{ value: 'زانستی', label: 'زانستی' }, { value: 'وێژەیی', label: 'وێژەیی' }]} value={bash} onChange={setBash} />
        <FormField label="ئامادەیی"                  value={amadayy}       onChange={setAmadayy} />
        <FormField label="ژمارە مۆبایلی قوتابی"      type="tel" value={studentPhone}  onChange={setStudentPhone}  placeholder="07..." />
        <FormField label="ژمارە مۆبایلی سەرپەرشتیار" type="tel" value={guardianPhone} onChange={setGuardianPhone} placeholder="07..." />
        <FormField label="ناونیشان"                   value={address}       onChange={setAddress} />
      </div>
      <SubmitSection isValid={isValid} isSubmitting={isSubmitting} error={submitError} onSubmit={handleSubmit} />
    </>
  );
}

/* ─── Language course modal ──────────────────────────────── */

const LANG_LEVELS  = ['ئاستی منداڵان', 'ئاستی گەورە'];
const LANG_OPTIONS = ['زمانی ئینگلیزی', 'زمانی عەرەبی', 'زمانی تورکی', 'زمانی فارسی'];

function LanguageCourseModal({ course, onClose }: ModalProps) {
  const [fullName, setFullName]         = useState('');
  const [birthYear, setBirthYear]       = useState('');
  const [grade, setGrade]               = useState('');
  const [motherPhone, setMotherPhone]   = useState('');
  const [fatherPhone, setFatherPhone]   = useState('');
  const [address, setAddress]           = useState('');
  const [level, setLevel]               = useState<string | null>(null);
  const [lang, setLang]                 = useState<string | null>(null);
  const [tookCourse, setTookCourse]     = useState<'yes' | 'no' | null>(null);
  const [prevCourse, setPrevCourse]     = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const prevCourseValid = tookCourse === 'yes' ? prevCourse.trim() !== '' : true;
  const isValid =
    fullName.trim() !== '' && birthYear.trim() !== '' && grade.trim() !== '' &&
    motherPhone.trim() !== '' && fatherPhone.trim() !== '' && address.trim() !== '' &&
    level !== null && lang !== null && tookCourse !== null && prevCourseValid;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await postRegistration({
        studentName: fullName, phoneNumber: motherPhone, courseId: course.id,
        metadata: {
          birthYear, grade, fatherPhone, address, level, lang, tookCourse,
          ...(tookCourse === 'yes' ? { prevCourse } : {}),
        },
      });
      setSubmitSuccess(true);
    } catch { setSubmitError('کێشەیەک هەیە، دووبارە هەوڵبدەرەوە'); }
    finally { setIsSubmitting(false); }
  };

  if (submitSuccess) return <SuccessScreen onClose={onClose} />;
  return (
    <>
      <div className="flex flex-col gap-5 pt-2 max-h-[55vh] overflow-y-auto pr-1">
        <FormField label="ناوی سیانی"          value={fullName}    onChange={setFullName} />
        <FormField label="ساڵی لەدایکبوون"     type="number" value={birthYear}  onChange={setBirthYear}  placeholder="٢٠١٥" />
        <FormField label="پۆل"                 value={grade}       onChange={setGrade} />
        <FormField label="ژمارە مۆبایلی دایک"  type="tel" value={motherPhone} onChange={setMotherPhone} placeholder="07..." />
        <FormField label="ژمارە مۆبایلی باوک"  type="tel" value={fatherPhone} onChange={setFatherPhone} placeholder="07..." />
        <FormField label="ناونیشان"             value={address}     onChange={setAddress} />
        <div className="border-t border-border" />
        <div>
          <p className="text-sm font-bold text-foreground mb-3">ئاست</p>
          <div className="flex flex-wrap gap-2">
            {LANG_LEVELS.map((l) => (
              <PillToggle key={l} label={l} selected={level === l} onClick={() => setLevel(level === l ? null : l)} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold text-foreground mb-3">زمان</p>
          <div className="flex flex-wrap gap-2">
            {LANG_OPTIONS.map((ln) => (
              <PillToggle key={ln} label={ln} selected={lang === ln} onClick={() => setLang(lang === ln ? null : ln)} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold text-foreground">پێشتر کۆرسی خوێندووە؟</p>
          <div className="flex gap-6">
            {(['yes', 'no'] as const).map((val) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer select-none">
                <input type="radio" name="langTookCourse" value={val}
                  checked={tookCourse === val}
                  onChange={() => { setTookCourse(val); if (val === 'no') setPrevCourse(''); }}
                  className="accent-primary w-4 h-4" />
                <span className="text-sm text-foreground">{val === 'yes' ? 'بەڵێ' : 'نەخێر'}</span>
              </label>
            ))}
          </div>
          {tookCourse === 'yes' && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <FormField label="کۆرسەکە چی بووە؟" value={prevCourse} onChange={setPrevCourse} />
            </motion.div>
          )}
        </div>
      </div>
      <SubmitSection isValid={isValid} isSubmitting={isSubmitting} error={submitError} onSubmit={handleSubmit} />
    </>
  );
}

/* ─── Grades 1-9 modal ───────────────────────────────────── */

const GRADES_1_9 = [
  { value: '1', label: 'پۆلی ١' }, { value: '2', label: 'پۆلی ٢' }, { value: '3', label: 'پۆلی ٣' },
  { value: '4', label: 'پۆلی ٤' }, { value: '5', label: 'پۆلی ٥' }, { value: '6', label: 'پۆلی ٦' },
  { value: '7', label: 'پۆلی ٧' }, { value: '8', label: 'پۆلی ٨' }, { value: '9', label: 'پۆلی ٩' },
];
const SUBJECTS_LOW  = ['بیرکاری', 'کوردی', 'ئینگلیزی'];
const SUBJECTS_HIGH = ['عەرەبی', 'ئینگلیزی', 'بیرکاری'];

function Grades1to9Modal({ course, onClose }: ModalProps) {
  const [fullName, setFullName]         = useState('');
  const [birthYear, setBirthYear]       = useState('');
  const [school, setSchool]             = useState('');
  const [motherPhone, setMotherPhone]   = useState('');
  const [fatherPhone, setFatherPhone]   = useState('');
  const [address, setAddress]           = useState('');
  const [grade, setGrade]               = useState('');
  const [subject, setSubject]           = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const gradeNum = parseInt(grade, 10);
  const isLow    = gradeNum >= 1 && gradeNum <= 3;
  const isHigh   = gradeNum >= 4 && gradeNum <= 9;
  const subjectOptions = isLow ? SUBJECTS_LOW : isHigh ? SUBJECTS_HIGH : [];

  const handleGradeChange = (v: string) => { setGrade(v); setSubject(null); };

  const isValid =
    fullName.trim() !== '' && birthYear.trim() !== '' && school.trim() !== '' &&
    motherPhone.trim() !== '' && fatherPhone.trim() !== '' && address.trim() !== '' &&
    grade !== '' && subject !== null;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await postRegistration({
        studentName: fullName, phoneNumber: motherPhone, courseId: course.id,
        metadata: { birthYear, school, fatherPhone, address, grade, subject },
      });
      setSubmitSuccess(true);
    } catch { setSubmitError('کێشەیەک هەیە، دووبارە هەوڵبدەرەوە'); }
    finally { setIsSubmitting(false); }
  };

  if (submitSuccess) return <SuccessScreen onClose={onClose} />;
  return (
    <>
      <div className="flex flex-col gap-5 pt-2 max-h-[55vh] overflow-y-auto pr-1">
        <FormField label="ناوی سیانی"         value={fullName}    onChange={setFullName} />
        <FormField label="ساڵی لەدایکبوون"    type="number" value={birthYear}  onChange={setBirthYear}  placeholder="٢٠١٥" />
        <FormField label="قوتابخانە"           value={school}      onChange={setSchool} />
        <FormField label="ژمارە مۆبایلی دایک" type="tel" value={motherPhone} onChange={setMotherPhone} placeholder="07..." />
        <FormField label="ژمارە مۆبایلی باوک" type="tel" value={fatherPhone} onChange={setFatherPhone} placeholder="07..." />
        <FormField label="ناونیشان"            value={address}     onChange={setAddress} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-foreground">پۆل</label>
          <select value={grade} onChange={(e) => handleGradeChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition">
            <option value="">— هەڵبژێرە —</option>
            {GRADES_1_9.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
        </div>
        {subjectOptions.length > 0 && (
          <motion.div key={isLow ? 'low' : 'high'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <p className="text-sm font-bold text-foreground mb-3">بابەت</p>
            <div className="flex flex-wrap gap-2">
              {subjectOptions.map((s) => (
                <PillToggle key={s} label={s} selected={subject === s} onClick={() => setSubject(subject === s ? null : s)} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <SubmitSection isValid={isValid} isSubmitting={isSubmitting} error={submitError} onSubmit={handleSubmit} />
    </>
  );
}

/* ─── Kindergarten modal ─────────────────────────────────── */

const TRANSPORT_OPTIONS = ['پاس', 'تەکسی', 'خۆمان هاتووچۆی پێدەکەین'] as const;

function KindergartenModal({ course, onClose }: ModalProps) {
  const [fullName, setFullName]           = useState('');
  const [birthYear, setBirthYear]         = useState('');
  const [address, setAddress]             = useState('');
  const [foodAllergy, setFoodAllergy]     = useState<string | null>(null);
  const [fruitAllergy, setFruitAllergy]   = useState<string | null>(null);
  const [transport, setTransport]         = useState<string | null>(null);
  const [motherPhone, setMotherPhone]     = useState('');
  const [fatherPhone, setFatherPhone]     = useState('');
  const [notes, setNotes]                 = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const yesNo = [{ value: 'yes', label: 'هەیە' }, { value: 'no', label: 'نییە' }];

  const isValid =
    fullName.trim() !== '' && birthYear.trim() !== '' && address.trim() !== '' &&
    foodAllergy !== null && fruitAllergy !== null && transport !== null &&
    motherPhone.trim() !== '' && fatherPhone.trim() !== '' && notes.trim() !== '';

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await postRegistration({
        studentName: fullName, phoneNumber: motherPhone, courseId: course.id,
        notes,
        metadata: { birthYear, address, foodAllergy, fruitAllergy, transport, fatherPhone },
      });
      setSubmitSuccess(true);
    } catch { setSubmitError('کێشەیەک هەیە، دووبارە هەوڵبدەرەوە'); }
    finally { setIsSubmitting(false); }
  };

  if (submitSuccess) return <SuccessScreen onClose={onClose} />;
  return (
    <>
      <div className="flex flex-col gap-5 pt-2 max-h-[55vh] overflow-y-auto pr-1">
        <FormField label="ناوی سیانی"      value={fullName}  onChange={setFullName} />
        <FormField label="ساڵی لەدایکبوون" type="number" value={birthYear} onChange={setBirthYear} placeholder="٢٠٢٠" />
        <FormField label="ناونیشان"         value={address}   onChange={setAddress} />
        <div className="border-t border-border" />
        <RadioGroup label="هەستیاری بە خواردن" name="foodAllergy"  options={yesNo} value={foodAllergy}  onChange={setFoodAllergy} />
        <RadioGroup label="هەستیاری بە میوە"   name="fruitAllergy" options={yesNo} value={fruitAllergy} onChange={setFruitAllergy} />
        <div className="border-t border-border" />
        <RadioGroup label="هاتووچۆ" name="transport"
          options={TRANSPORT_OPTIONS.map((t) => ({ value: t, label: t }))}
          value={transport} onChange={setTransport} />
        <div className="border-t border-border" />
        <FormField label="ژمارە مۆبایلی دایک" type="tel" value={motherPhone} onChange={setMotherPhone} placeholder="07..." />
        <FormField label="ژمارە مۆبایلی باوک" type="tel" value={fatherPhone} onChange={setFatherPhone} placeholder="07..." />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-foreground">تایبەتمەندی منداڵەکە</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
            placeholder="هەر تایبەتمەندیەک کە پێویستە بزانین..." />
        </div>
      </div>
      <SubmitSection isValid={isValid} isSubmitting={isSubmitting} error={submitError} onSubmit={handleSubmit} />
    </>
  );
}

/* ─── Kurdish Alphabet modal ─────────────────────────────── */

function KurdishAlphabetModal({ course, onClose }: ModalProps) {
  const [fullName, setFullName]           = useState('');
  const [birthYear, setBirthYear]         = useState('');
  const [motherPhone, setMotherPhone]     = useState('');
  const [fatherPhone, setFatherPhone]     = useState('');
  const [address, setAddress]             = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isValid =
    fullName.trim() !== '' && birthYear.trim() !== '' &&
    motherPhone.trim() !== '' && fatherPhone.trim() !== '' && address.trim() !== '';

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await postRegistration({
        studentName: fullName, phoneNumber: motherPhone, courseId: course.id,
        metadata: { birthYear, fatherPhone, address },
      });
      setSubmitSuccess(true);
    } catch { setSubmitError('کێشەیەک هەیە، دووبارە هەوڵبدەرەوە'); }
    finally { setIsSubmitting(false); }
  };

  if (submitSuccess) return <SuccessScreen onClose={onClose} />;
  return (
    <>
      <div className="flex flex-col gap-5 pt-2 max-h-[55vh] overflow-y-auto pr-1">
        <FormField label="ناوی سیانی"          value={fullName}    onChange={setFullName} />
        <FormField label="ساڵی لەدایکبوون"     type="number" value={birthYear}  onChange={setBirthYear}  placeholder="٢٠١٨" />
        <FormField label="ژمارە مۆبایلی دایک"  type="tel"    value={motherPhone} onChange={setMotherPhone} placeholder="07..." />
        <FormField label="ژمارە مۆبایلی باوک"  type="tel"    value={fatherPhone} onChange={setFatherPhone} placeholder="07..." />
        <FormField label="ناونیشان"             value={address}     onChange={setAddress} />
      </div>
      <SubmitSection isValid={isValid} isSubmitting={isSubmitting} error={submitError} onSubmit={handleSubmit} />
    </>
  );
}

/* ─── Visa modal ─────────────────────────────────────────── */

function VisaModal({ course, onClose }: ModalProps) {
  const [fullName, setFullName]           = useState('');
  const [birthYear, setBirthYear]         = useState('');
  const [phone, setPhone]                 = useState('');
  const [address, setAddress]             = useState('');
  const [notes, setNotes]                 = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitError, setSubmitError]     = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isValid =
    fullName.trim() !== '' && birthYear.trim() !== '' &&
    phone.trim() !== '' && address.trim() !== '' && notes.trim() !== '';

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true); setSubmitError('');
    try {
      await postRegistration({
        studentName: fullName, phoneNumber: phone, courseId: course.id,
        notes,
        metadata: { birthYear, address },
      });
      setSubmitSuccess(true);
    } catch { setSubmitError('کێشەیەک هەیە، دووبارە هەوڵبدەرەوە'); }
    finally { setIsSubmitting(false); }
  };

  if (submitSuccess) return <SuccessScreen onClose={onClose} />;
  return (
    <>
      <div className="flex flex-col gap-5 pt-2 max-h-[55vh] overflow-y-auto pr-1">
        <FormField label="ناوی سیانی"      value={fullName}  onChange={setFullName} />
        <FormField label="ساڵی لەدایکبوون" type="number" value={birthYear} onChange={setBirthYear} placeholder="١٩٩٠" />
        <FormField label="ژمارەی مۆبایل"   type="tel"    value={phone}     onChange={setPhone}     placeholder="07..." />
        <FormField label="ناونیشان"         value={address}   onChange={setAddress} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-foreground">تێبینی یان داواکاری تایبەت</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
            placeholder="هەر تێبینی یان داواکارییەک بنووسە..." />
        </div>
      </div>
      <SubmitSection isValid={isValid} isSubmitting={isSubmitting} error={submitError} onSubmit={handleSubmit} />
    </>
  );
}

/* ─── Main component ─────────────────────────────────────── */

export function Courses() {
  const { dir } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openModal  = (course: Course) => setSelectedCourse(course);
  const closeModal = () => setSelectedCourse(null);

  return (
    <>
      <section id="courses" className="bg-background relative pt-28 pb-24 md:pt-36 md:pb-32">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6" dir={dir}>
            {COURSES.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="group bg-card border border-border rounded-2xl p-6 flex flex-col cursor-default transition-all duration-300 hover:-translate-y-2"
                style={{ boxShadow: '0 2px 12px rgba(15,23,65,0.07)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px -10px rgba(15,23,65,0.18), 0 2px 8px rgba(15,23,65,0.08)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(15,23,65,0.07)'; }}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:text-white ${course.iconBg}`}>
                  {course.icon}
                </div>
                <h3 className="text-base font-bold text-foreground mb-4 leading-snug flex-1">{course.title}</h3>
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
        <DialogContent className="sm:max-w-lg" dir={dir}>
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-foreground leading-snug">
              {selectedCourse?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedCourse?.id === 'grade12'          && <Grade12Modal          course={selectedCourse} onClose={closeModal} />}
          {selectedCourse?.id === 'grade10-11'        && <Grade1011Modal        course={selectedCourse} onClose={closeModal} />}
          {selectedCourse?.id === 'language'          && <LanguageCourseModal   course={selectedCourse} onClose={closeModal} />}
          {selectedCourse?.id === 'grades1-9'         && <Grades1to9Modal       course={selectedCourse} onClose={closeModal} />}
          {selectedCourse?.id === 'kindergarten'      && <KindergartenModal     course={selectedCourse} onClose={closeModal} />}
          {selectedCourse?.id === 'kurdish-alphabet'  && <KurdishAlphabetModal  course={selectedCourse} onClose={closeModal} />}
          {selectedCourse?.id === 'visa'              && <VisaModal             course={selectedCourse} onClose={closeModal} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
