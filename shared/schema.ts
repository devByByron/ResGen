import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resumes = pgTable("resumes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  title: text("title").notNull().default("My Resume"),
  data: json("data").notNull(),
  template: text("template").notNull().default("minimalist"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const resumeDataSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().min(1, "Phone number is required"),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    summary: z.string().optional(),
  }),
  experience: z.array(z.object({
    jobTitle: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    achievements: z.string(),
  })).default([]),
  education: z.array(z.object({
    degree: z.string(),
    fieldOfStudy: z.string(),
    school: z.string(),
    location: z.string().optional(),
    graduationYear: z.string(),
    gpa: z.string().optional(),
  })).default([]),
  skills: z.object({
    technical: z.string().optional(),
    soft: z.string().optional(),
    languages: z.string().optional(),
  }).default({}),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string().optional(),
    url: z.string().optional(),
  })).default([]),
  projects: z.array(z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.string(),
    url: z.string().optional(),
  })).default([]),
});

export const insertResumeSchema = createInsertSchema(resumes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  data: resumeDataSchema,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Resume = typeof resumes.$inferSelect;
export type InsertResume = z.infer<typeof insertResumeSchema>;
export type ResumeData = z.infer<typeof resumeDataSchema>;
