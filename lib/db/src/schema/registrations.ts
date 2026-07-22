import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const registrationsTable = pgTable("registrations", {
  id: serial("id").primaryKey(),
  studentName: text("student_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  courseId: text("course_id").notNull(),
  courseName: text("course_name").notNull(),
  teacherName: text("teacher_name"),                         // nullable — optional
  shift: text("shift").notNull(),                            // 'morning' | 'evening'
  language: text("language").notNull(),                      // 'ku' | 'ar' | 'en'
  notes: text("notes"),
  metadata: text("metadata"),                                // nullable JSON blob for course-specific fields
  status: text("status").notNull().default("pending"),       // 'pending' | 'approved'
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertRegistrationSchema = createInsertSchema(registrationsTable).omit({
  id: true,
  status: true,
  submittedAt: true,
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrationsTable.$inferSelect;
