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

const LANG_LEVELS    = ['ئاستی منداڵان', 'ئاستی گەورە'];
const LANG_OPTIONS   = ['زمانی ئینگلیزی', 'زمانی عەرەبی', 'زمانی تورکی', 'زمانی فارسی'];

/** Modal for "خولی فێربوونی زمان" */
function LanguageCourseModal() {
  const [fullName, setFullName]       = useState('');
  const [birthYear, setBirthYear]     = useState('');
  const [grade, setGrade]             = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [address, setAddress]         = useState('');
  const [level, setLevel]             = useState<string | null>(null);
  const [lang, setLang]               = useState<string | null>(null);
  const [tookCourse, setTookCourse]   = useState<'yes' | 'no' | null>(null);
  const [prevCourse, setPrevCourse]   = useState('');

  return (
    <div className="flex flex-col gap-5 pt-2 max-h-[65vh] overflow-y-auto pr-1">
      {/* Personal info */}
      <FormField label="ناوی سیانی"        value={fullName}    onChange={setFullName} />
      <FormField label="ساڵی لەدایکبوون"   type="number" value={birthYear}  onChange={setBirthYear} placeholder="٢٠١٥" />
      <FormField label="پۆل"               value={grade}       onChange={setGrade} />
      <FormField label="ژمارە مۆبایلی دایک" type="tel"   value={motherPhone} onChange={setMotherPhone} placeholder="07..." />
      <FormField label="ژمارە مۆبایلی باوک" type="tel"   value={fatherPhone} onChange={setFatherPhone} placeholder="07..." />
      <FormField label="ناونیشان"           value={address}     onChange={setAddress} />

      {/* Level */}
      <div>
        <p className="text-sm font-bold text-foreground mb-3">ئاست</p>
        <div className="flex flex-wrap gap-2">
          {LANG_LEVELS.map((l) => (
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
          {LANG_OPTIONS.map((ln) => (
            <PillToggle
              key={ln}
              label={ln}
              selected={lang === ln}
              onClick={() => setLang(lang === ln ? null : ln)}
            />
          ))}
        </div>
      </div>

      {/* Previous course question */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-foreground">پێشتر کۆرسی خوێندووە؟</p>
        <div className="flex gap-6">
          {(['yes', 'no'] as const).map((val) => (
            <label key={val} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="radio"
                name="tookCourse"
                value={val}
                checked={tookCourse === val}
                onChange={() => {
                  setTookCourse(val);
                  if (val === 'no') setPrevCourse('');
                }}
                className="accent-primary w-4 h-4"
              />
              <span className="text-sm text-foreground">{val === 'yes' ? 'بەڵێ' : 'نەخێر'}</span>
            </label>
          ))}
        </div>

        {tookCourse === 'yes' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FormField
              label="کۆرسەکە چی بووە؟"
              value={prevCourse}
              onChange={setPrevCourse}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

const GRADES = [
  { value: '1', label: 'پۆلی ١' },
  { value: '2', label: 'پۆلی ٢' },
  { value: '3', label: 'پۆلی ٣' },
  { value: '4', label: 'پۆلی ٤' },
  { value: '5', label: 'پۆلی ٥' },
  { value: '6', label: 'پۆلی ٦' },
  { value: '7', label: 'پۆلی ٧' },
  { value: '8', label: 'پۆلی ٨' },
  { value: '9', label: 'پۆلی ٩' },
];

const SUBJECTS_LOW  = ['بیرکاری', 'کوردی', 'ئینگلیزی'];   // grades 1-3
const SUBJECTS_HIGH = ['عەرەبی', 'ئینگلیزی', 'بیرکاری'];  // grades 4-9

/** Labelled text / number input */
function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
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

/** Modal for "خولی وانەکانی قوتابخانە ١ بۆ ٩" */
function Grades1to9Modal() {
  const [fullName, setFullName]     = useState('');
  const [birthYear, setBirthYear]   = useState('');
  const [school, setSchool]         = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [address, setAddress]       = useState('');
  const [grade, setGrade]           = useState('');
  const [subject, setSubject]       = useState<string | null>(null);

  const gradeNum = parseInt(grade, 10);
  const isLow    = gradeNum >= 1 && gradeNum <= 3;
  const isHigh   = gradeNum >= 4 && gradeNum <= 9;
  const subjects = isLow ? SUBJECTS_LOW : isHigh ? SUBJECTS_HIGH : [];

  const handleGradeChange = (v: string) => {
    setGrade(v);
    setSubject(null); // reset subject when grade changes
  };

  return (
    <div className="flex flex-col gap-5 pt-2 max-h-[65vh] overflow-y-auto pr-1">
      {/* Standard fields */}
      <FormField label="ناوی سیانی"              value={fullName}    onChange={setFullName} />
      <FormField label="ساڵی لەدایکبوون"          type="number" value={birthYear}  onChange={setBirthYear} placeholder="٢٠١٥" />
      <FormField label="قوتابخانە"                value={school}      onChange={setSchool} />
      <FormField label="ژمارە مۆبایلی دایک"       type="tel"    value={motherPhone} onChange={setMotherPhone} placeholder="07..." />
      <FormField label="ژمارە مۆبایلی باوک"       type="tel"    value={fatherPhone} onChange={setFatherPhone} placeholder="07..." />
      <FormField label="ناونیشان"                 value={address}     onChange={setAddress} />

      {/* Grade dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-foreground">پۆل</label>
        <select
          value={grade}
          onChange={(e) => handleGradeChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
        >
          <option value="">— هەڵبژێرە —</option>
          {GRADES.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>
      </div>

      {/* Dynamic subject selection */}
      {subjects.length > 0 && (
        <motion.div
          key={isLow ? 'low' : 'high'}
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

const TRANSPORT_OPTIONS = ['پاس', 'تەکسی', 'خۆمان هاتووچۆی پێدەکەین'] as const;
type Transport = typeof TRANSPORT_OPTIONS[number] | null;

/** Radio group helper */
function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string;
  name: string;
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
              type="radio"
              name={name}
              value={o.value}
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

/** Modal for "خولی ئامادەکاری بۆ قوتابخانە (ئاستی ڕەوزە)" */
function KindergartenModal() {
  const [fullName, setFullName]         = useState('');
  const [birthYear, setBirthYear]       = useState('');
  const [address, setAddress]           = useState('');
  const [foodAllergy, setFoodAllergy]   = useState<string | null>(null);
  const [fruitAllergy, setFruitAllergy] = useState<string | null>(null);
  const [transport, setTransport]       = useState<Transport>(null);
  const [motherPhone, setMotherPhone]   = useState('');
  const [fatherPhone, setFatherPhone]   = useState('');
  const [notes, setNotes]               = useState('');

  const yesNo = [
    { value: 'yes', label: 'هەیە' },
    { value: 'no',  label: 'نییە' },
  ];

  return (
    <div className="flex flex-col gap-5 pt-2 max-h-[65vh] overflow-y-auto pr-1">
      {/* Basic info */}
      <FormField label="ناوی سیانی"      value={fullName}  onChange={setFullName} />
      <FormField label="ساڵی لەدایکبوون" type="number" value={birthYear} onChange={setBirthYear} placeholder="٢٠٢٠" />
      <FormField label="ناونیشان"         value={address}   onChange={setAddress} />

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Health & allergies */}
      <RadioGroup
        label="هەستیاری بە خواردن"
        name="foodAllergy"
        options={yesNo}
        value={foodAllergy}
        onChange={setFoodAllergy}
      />
      <RadioGroup
        label="هەستیاری بە میوە"
        name="fruitAllergy"
        options={yesNo}
        value={fruitAllergy}
        onChange={setFruitAllergy}
      />

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Transportation */}
      <RadioGroup
        label="هاتووچۆ"
        name="transport"
        options={TRANSPORT_OPTIONS.map((t) => ({ value: t, label: t }))}
        value={transport}
        onChange={(v) => setTransport(v as Transport)}
      />

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Contact */}
      <FormField label="ژمارە مۆبایلی دایک" type="tel" value={motherPhone} onChange={setMotherPhone} placeholder="07..." />
      <FormField label="ژمارە مۆبایلی باوک" type="tel" value={fatherPhone} onChange={setFatherPhone} placeholder="07..." />

      {/* Notes textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-foreground">تایبەتمەندی منداڵەکە</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
          placeholder="هەر تایبەتمەندیەک کە پێویستە بزانین..."
        />
      </div>
    </div>
  );
}

const GRADE12_SUBJECTS = ['بیرکاری', 'کیمیا', 'فیزیا', 'زیندەزانی', 'ئینگلیزی', 'عەرەبی'];

/** Modal for "خولی پۆلی ١٢" */
function Grade12Modal() {
  const [fullName, setFullName]     = useState('');
  const [phone1, setPhone1]         = useState('');
  const [phone2, setPhone2]         = useState('');
  const [amadayy, setAmadayy]       = useState('');
  const [bash, setBash]             = useState<string | null>(null);
  const [shwen, setShwen]           = useState<string | null>(null);
  const [ragaz, setRagaz]           = useState<string | null>(null);
  const [subjects, setSubjects]     = useState<string[]>([]);
  const [teacher, setTeacher]       = useState('');

  const toggleSubject = (s: string) =>
    setSubjects((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  return (
    <div className="flex flex-col gap-5 pt-2 max-h-[65vh] overflow-y-auto pr-1">
      {/* Personal & school info */}
      <FormField label="ناوی سیانی"   value={fullName} onChange={setFullName} />
      <FormField label="ژمارە مۆبایل ١" type="tel" value={phone1} onChange={setPhone1} placeholder="07..." />
      <FormField label="ژمارە مۆبایل ٢" type="tel" value={phone2} onChange={setPhone2} placeholder="07..." />
      <FormField label="ئامادەیی"      value={amadayy}  onChange={setAmadayy} />

      <div className="border-t border-border" />

      {/* بەش */}
      <RadioGroup
        label="بەش"
        name="bash"
        options={[{ value: 'زانستی', label: 'زانستی' }, { value: 'وێژەیی', label: 'وێژەیی' }]}
        value={bash}
        onChange={setBash}
      />

      {/* شوێن */}
      <RadioGroup
        label="شوێن"
        name="shwen"
        options={[{ value: 'ناو شار', label: 'ناو شار' }, { value: 'دەرەوەی شار', label: 'دەرەوەی شار' }]}
        value={shwen}
        onChange={setShwen}
      />

      {/* ڕەگەز */}
      <RadioGroup
        label="ڕەگەز"
        name="ragaz"
        options={[{ value: 'نێر', label: 'نێر' }, { value: 'مێ', label: 'مێ' }]}
        value={ragaz}
        onChange={setRagaz}
      />

      <div className="border-t border-border" />

      {/* بەشداری وانەکان — checkboxes */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold text-foreground">بەشداری وانەکان</p>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {GRADE12_SUBJECTS.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={subjects.includes(s)}
                onChange={() => toggleSubject(s)}
                className="accent-primary w-4 h-4 rounded"
              />
              <span className="text-sm text-foreground">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* هەڵبژاردنی مامۆستا */}
      <FormField label="هەڵبژاردنی مامۆستا" value={teacher} onChange={setTeacher} />
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

          {selectedCourse?.id === 'grade12'       && <Grade12Modal />}
          {selectedCourse?.id === 'language'      && <LanguageCourseModal />}
          {selectedCourse?.id === 'grades1-9'    && <Grades1to9Modal />}
          {selectedCourse?.id === 'kindergarten' && <KindergartenModal />}
        </DialogContent>
      </Dialog>
    </>
  );
}
