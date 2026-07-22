import { Router } from "express";
import { db } from "@workspace/db";
import { registrationsTable } from "@workspace/db";
import { eq, desc, count, gte, and } from "drizzle-orm";
import crypto from "crypto";
import {
  CreateRegistrationBody,
  ListRegistrationsQueryParams,
  AdminLoginBody,
} from "@workspace/api-zod";

const router = Router();
const adminRouter = Router();
const coursesRouter = Router();

// ---------------------------------------------------------------------------
// Admin password
// ---------------------------------------------------------------------------
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD environment variable is required.");
}

// ---------------------------------------------------------------------------
// In-memory token store with TTL (24h)
// ---------------------------------------------------------------------------
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const activeTokens = new Map<string, { expiresAt: number }>();

function issueToken(): string {
  const token = crypto.randomBytes(32).toString("hex");
  activeTokens.set(token, { expiresAt: Date.now() + TOKEN_TTL_MS });
  for (const [t, meta] of activeTokens) {
    if (meta.expiresAt < Date.now()) activeTokens.delete(t);
  }
  return token;
}

function validateToken(authHeader: string | undefined): boolean {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  const meta = activeTokens.get(token);
  if (!meta) return false;
  if (meta.expiresAt < Date.now()) {
    activeTokens.delete(token);
    return false;
  }
  return true;
}

function revokeToken(authHeader: string | undefined): void {
  if (!authHeader?.startsWith("Bearer ")) return;
  activeTokens.delete(authHeader.slice(7));
}

// ---------------------------------------------------------------------------
// Rate limiter
// ---------------------------------------------------------------------------
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): "ok" | "blocked" {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt < now) return "ok";
  return entry.count >= MAX_ATTEMPTS ? "blocked" : "ok";
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(ip) ?? { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (entry.resetAt < now) { entry.count = 0; entry.resetAt = now + RATE_WINDOW_MS; }
  entry.count += 1;
  failedAttempts.set(ip, entry);
}

function clearFailures(ip: string): void {
  failedAttempts.delete(ip);
}

// ---------------------------------------------------------------------------
// Grade 12 courses
// ---------------------------------------------------------------------------
const COURSES = [
  {
    id: "chemistry",
    nameKu: "کیمیا",
    nameAr: "الكيمياء",
    nameEn: "Chemistry",
    descriptionKu: "تێگەیشتنی قووڵ لە بابەتەکانی کیمیای پۆلی دوازدەم",
    descriptionAr: "فهم عميق لمواضيع الكيمياء للصف الثاني عشر",
    descriptionEn: "Deep understanding of Grade 12 Chemistry topics",
    icon: "FlaskConical",
    duration: "4 months",
    enrolledCount: null as number | null,
  },
  {
    id: "physics",
    nameKu: "فیزیا",
    nameAr: "الفيزياء",
    nameEn: "Physics",
    descriptionKu: "تێگەیشتنی یاسا و تیۆریەکانی فیزیای پۆلی دوازدەم",
    descriptionAr: "فهم قوانين ونظريات الفيزياء للصف الثاني عشر",
    descriptionEn: "Understanding laws and theories of Grade 12 Physics",
    icon: "Atom",
    duration: "4 months",
    enrolledCount: null as number | null,
  },
  {
    id: "math",
    nameKu: "بیرکاری",
    nameAr: "الرياضيات",
    nameEn: "Mathematics",
    descriptionKu: "تەمرین و شیکاری بابەتەکانی بیرکاری پۆلی دوازدەم",
    descriptionAr: "تمارين وتحليل مواضيع الرياضيات للصف الثاني عشر",
    descriptionEn: "Practice and analysis of Grade 12 Mathematics topics",
    icon: "Sigma",
    duration: "4 months",
    enrolledCount: null as number | null,
  },
  {
    id: "arabic-g12",
    nameKu: "عەرەبی",
    nameAr: "اللغة العربية",
    nameEn: "Arabic",
    descriptionKu: "ئامادەکاری بۆ تاقیکردنەوەی عەرەبی پۆلی دوازدەم",
    descriptionAr: "التحضير لامتحانات اللغة العربية للصف الثاني عشر",
    descriptionEn: "Preparation for Grade 12 Arabic language exams",
    icon: "BookText",
    duration: "4 months",
    enrolledCount: null as number | null,
  },
  {
    id: "english-g12",
    nameKu: "ئینگلیزی",
    nameAr: "اللغة الإنجليزية",
    nameEn: "English",
    descriptionKu: "ئامادەکاری بۆ تاقیکردنەوەی ئینگلیزی پۆلی دوازدەم",
    descriptionAr: "التحضير لامتحانات اللغة الإنجليزية للصف الثاني عشر",
    descriptionEn: "Preparation for Grade 12 English language exams",
    icon: "Globe",
    duration: "4 months",
    enrolledCount: null as number | null,
  },
];

const courseNameMap: Record<string, string> = {
  chemistry: "کیمیا",
  physics: "فیزیا",
  math: "بیرکاری",
  "arabic-g12": "عەرەبی",
  "english-g12": "ئینگلیزی",
  "grade12": "خولی پۆلی ١٢",
  "grade10-11": "خولی پۆلی ١٠ و ١١",
  "language": "خولی فێربوونی زمان",
  "grades1-9": "خولی وانەکانی قوتابخانە ١ بۆ ٩",
  "kindergarten": "خولی ئامادەکاری بۆ قوتابخانە",
  "kurdish-alphabet": "خولی ئەلفوبێی کوردی",
  "visa": "خولی ڤیزای هاوسەرگیری",
};

// ---------------------------------------------------------------------------
// GET /api/courses
// ---------------------------------------------------------------------------
coursesRouter.get("/", async (_req, res) => {
  const counts = await db
    .select({ courseId: registrationsTable.courseId, count: count() })
    .from(registrationsTable)
    .groupBy(registrationsTable.courseId);

  const countMap = Object.fromEntries(counts.map((c) => [c.courseId, c.count]));
  const coursesWithCounts = COURSES.map((c) => ({
    ...c,
    enrolledCount: countMap[c.id] ?? 0,
  }));

  res.json(coursesWithCounts);
});

// ---------------------------------------------------------------------------
// GET /api/registrations/status  (public — check by phone number)
// ---------------------------------------------------------------------------
router.get("/status", async (req, res) => {
  const phone = (req.query.phone as string | undefined)?.trim();
  if (!phone) {
    res.status(400).json({ error: "Phone number required" });
    return;
  }

  const [reg] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.phoneNumber, phone))
    .orderBy(desc(registrationsTable.submittedAt))
    .limit(1);

  if (!reg) {
    res.json({ status: "not_found" });
    return;
  }

  res.json({
    status: reg.status,
    studentName: reg.studentName,
    courseId: reg.courseId,
    courseName: reg.courseName,
  });
});

// ---------------------------------------------------------------------------
// POST /api/registrations
// ---------------------------------------------------------------------------
router.post("/", async (req, res) => {
  const parsed = CreateRegistrationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid registration data" });
    return;
  }

  const data = parsed.data;
  const courseName = courseNameMap[data.courseId] ?? data.courseId;

  const teacherName =
    typeof req.body.teacherName === 'string' && req.body.teacherName.trim()
      ? req.body.teacherName.trim()
      : null;

  const metadata =
    typeof req.body.metadata === 'string' && req.body.metadata.trim()
      ? req.body.metadata
      : null;

  const [reg] = await db
    .insert(registrationsTable)
    .values({
      studentName: data.studentName,
      phoneNumber: data.phoneNumber,
      courseId: data.courseId,
      courseName,
      teacherName,
      shift: data.shift,
      language: data.language,
      notes: data.notes ?? null,
      metadata,
    })
    .returning();

  res.status(201).json(reg);
});

// ---------------------------------------------------------------------------
// PATCH /api/registrations/:id/approve  (requires Bearer token)
// ---------------------------------------------------------------------------
router.patch("/:id/approve", async (req, res) => {
  if (!validateToken(req.headers.authorization)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid registration ID" });
    return;
  }

  const [updated] = await db
    .update(registrationsTable)
    .set({ status: "approved" })
    .where(eq(registrationsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  res.json(updated);
});

// ---------------------------------------------------------------------------
// GET /api/registrations/admin  (requires Bearer token)
// ---------------------------------------------------------------------------
router.get("/admin", async (req, res) => {
  if (!validateToken(req.headers.authorization)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = ListRegistrationsQueryParams.safeParse(req.query);
  const { courseId, shift } = parsed.success ? parsed.data : { courseId: undefined, shift: undefined };

  const conditions = [];
  if (courseId) conditions.push(eq(registrationsTable.courseId, courseId));
  if (shift) conditions.push(eq(registrationsTable.shift, shift));

  const registrations = await db
    .select()
    .from(registrationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(registrationsTable.submittedAt));

  res.json(registrations);
});

// ---------------------------------------------------------------------------
// GET /api/registrations/stats  (requires Bearer token)
// ---------------------------------------------------------------------------
router.get("/stats", async (req, res) => {
  if (!validateToken(req.headers.authorization)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const [totals] = await db
    .select({ total: count() })
    .from(registrationsTable);

  const shiftCounts = await db
    .select({ shift: registrationsTable.shift, count: count() })
    .from(registrationsTable)
    .groupBy(registrationsTable.shift);

  const courseCounts = await db
    .select({
      courseId: registrationsTable.courseId,
      courseName: registrationsTable.courseName,
      count: count(),
    })
    .from(registrationsTable)
    .groupBy(registrationsTable.courseId, registrationsTable.courseName);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const [recentCount] = await db
    .select({ count: count() })
    .from(registrationsTable)
    .where(gte(registrationsTable.submittedAt, sevenDaysAgo));

  res.json({
    totalRegistrations: totals.total,
    morningCount: shiftCounts.find((s) => s.shift === "morning")?.count ?? 0,
    eveningCount: shiftCounts.find((s) => s.shift === "evening")?.count ?? 0,
    byCourse: courseCounts.map((c) => ({
      courseId: c.courseId,
      courseName: c.courseName,
      count: c.count,
    })),
    recentRegistrations: recentCount.count,
  });
});

// ---------------------------------------------------------------------------
// POST /api/admin/login
// ---------------------------------------------------------------------------
adminRouter.post("/login", (req, res) => {
  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim() ?? req.socket.remoteAddress ?? "unknown";

  if (checkRateLimit(ip) === "blocked") {
    res.status(429).json({ error: "Too many failed attempts. Try again in 15 minutes." });
    return;
  }

  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success || parsed.data.password !== ADMIN_PASSWORD) {
    recordFailure(ip);
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  clearFailures(ip);
  const token = issueToken();
  res.json({ token });
});

// ---------------------------------------------------------------------------
// POST /api/admin/logout
// ---------------------------------------------------------------------------
adminRouter.post("/logout", (req, res) => {
  revokeToken(req.headers.authorization);
  res.json({ ok: true });
});

export { router as registrationsRouter, adminRouter, coursesRouter };
