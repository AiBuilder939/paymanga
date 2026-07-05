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
// Admin password — required, no hardcoded fallback
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
  // Purge expired tokens opportunistically
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
// Rate limiter — simple in-memory per-IP
// ---------------------------------------------------------------------------
const failedAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 min window
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): "ok" | "blocked" {
  const now = Date.now();
  const entry = failedAttempts.get(ip);
  if (!entry || entry.resetAt < now) {
    return "ok";
  }
  return entry.count >= MAX_ATTEMPTS ? "blocked" : "ok";
}

function recordFailure(ip: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(ip) ?? { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (entry.resetAt < now) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count += 1;
  failedAttempts.set(ip, entry);
}

function clearFailures(ip: string): void {
  failedAttempts.delete(ip);
}

// ---------------------------------------------------------------------------
// Static courses data
// ---------------------------------------------------------------------------
const COURSES = [
  {
    id: "english",
    nameKu: "زمانی ئینگلیزی",
    nameAr: "اللغة الإنجليزية",
    nameEn: "English Language",
    descriptionKu: "فێربوونی زمانی ئینگلیزی لە ئاستی سەرەتا تا ئاستی پیشکەوتوو",
    descriptionAr: "تعلم اللغة الإنجليزية من المستوى المبتدئ حتى المتقدم",
    descriptionEn: "Learn English from beginner to advanced level with experienced teachers",
    icon: "BookOpen",
    duration: "3 months",
    enrolledCount: null as number | null,
  },
  {
    id: "it",
    nameKu: "زانستی کامپیوتەر و IT",
    nameAr: "علوم الكمبيوتر وتقنية المعلومات",
    nameEn: "IT & Computer Skills",
    descriptionKu: "فێربوونی مایکڕۆسۆفت ئۆفیس، دیزاین، و بەرنامەسازی سەرەتایی",
    descriptionAr: "تعلم مايكروسوفت أوفيس والتصميم والبرمجة الأساسية",
    descriptionEn: "Master Microsoft Office, graphic design, and basic programming skills",
    icon: "Monitor",
    duration: "3 months",
    enrolledCount: null as number | null,
  },
  {
    id: "human-dev",
    nameKu: "گەشەسەندنی مرۆڤایەتی",
    nameAr: "التطوير البشري",
    nameEn: "Human Development",
    descriptionKu: "پەرەپێدانی شارەزاییەکانی کەسایەتی، ڕابەرایەتی، و پەیوەندی کردن",
    descriptionAr: "تطوير مهارات الشخصية والقيادة والتواصل الفعّال",
    descriptionEn: "Develop personality skills, leadership, and effective communication",
    icon: "Users",
    duration: "2 months",
    enrolledCount: null as number | null,
  },
  {
    id: "accounting",
    nameKu: "ژمێریاری و دارایی",
    nameAr: "المحاسبة والمالية",
    nameEn: "Accounting & Finance",
    descriptionKu: "فێربوونی بنەماکانی ژمێریاری و بەڕێوەبردنی دارایی",
    descriptionAr: "تعلم أساسيات المحاسبة وإدارة الشؤون المالية",
    descriptionEn: "Learn the fundamentals of accounting and financial management",
    icon: "Calculator",
    duration: "3 months",
    enrolledCount: null as number | null,
  },
  {
    id: "graphic-design",
    nameKu: "دیزاینی گرافیکی",
    nameAr: "التصميم الجرافيكي",
    nameEn: "Graphic Design",
    descriptionKu: "فێربوونی فۆتۆشۆپ، ئیلستراتۆر، و دیزاینی دیجیتاڵ",
    descriptionAr: "تعلم فوتوشوب وإليستريتور والتصميم الرقمي",
    descriptionEn: "Master Photoshop, Illustrator, and digital design techniques",
    icon: "Palette",
    duration: "3 months",
    enrolledCount: null as number | null,
  },
  {
    id: "arabic",
    nameKu: "زمانی عەرەبی",
    nameAr: "اللغة العربية",
    nameEn: "Arabic Language",
    descriptionKu: "فێربوونی زمانی عەرەبی لە ئاستی سەرەتا تا ئاستی پیشکەوتوو",
    descriptionAr: "تعلم اللغة العربية الفصحى من الأساس",
    descriptionEn: "Learn classical and modern Arabic from beginner to advanced",
    icon: "Languages",
    duration: "3 months",
    enrolledCount: null as number | null,
  },
];

const courseNameMap: Record<string, string> = {
  english: "English Language",
  it: "IT & Computer Skills",
  "human-dev": "Human Development",
  accounting: "Accounting & Finance",
  "graphic-design": "Graphic Design",
  arabic: "Arabic Language",
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

  const [reg] = await db
    .insert(registrationsTable)
    .values({
      studentName: data.studentName,
      phoneNumber: data.phoneNumber,
      courseId: data.courseId,
      courseName,
      shift: data.shift,
      language: data.language,
      notes: data.notes ?? null,
    })
    .returning();

  res.status(201).json(reg);
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
