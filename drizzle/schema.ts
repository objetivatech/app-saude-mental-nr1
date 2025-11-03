import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extended with userType to support multiple user profiles.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: text("email", { length: 320 }),
  loginMethod: text("loginMethod", { length: 64 }),
  role: text("role").default("user").notNull(),
  userType: text("userType"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Companies table - stores company information
 */
export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  companyName: text("companyName", { length: 255 }).notNull(),
  cnpj: text("cnpj", { length: 18 }).notNull().unique(),
  contactEmail: text("contactEmail", { length: 320 }).notNull(),
  contactPhone: text("contactPhone", { length: 20 }),
  planId: integer("planId").references(() => plans.id),
  approved: integer("approved", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Employees table - stores employee information
 */
export const employees = sqliteTable("employees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  companyId: integer("companyId").notNull().references(() => companies.id),
  employeeName: text("employeeName", { length: 255 }).notNull(),
  employeeEmail: text("employeeEmail", { length: 320 }).notNull(),
  department: text("department", { length: 100 }),
  position: text("position", { length: 100 }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Health Professionals table - stores health professional information
 */
export const healthProfessionals = sqliteTable("healthProfessionals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().references(() => users.id),
  professionalName: text("professionalName", { length: 255 }).notNull(),
  specialty: text("specialty", { length: 100 }).notNull(),
  registrationNumber: text("registrationNumber", { length: 50 }).notNull().unique(),
  contactEmail: text("contactEmail", { length: 320 }).notNull(),
  contactPhone: text("contactPhone", { length: 20 }),
  bio: text("bio"),
  approved: integer("approved", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
});

export type HealthProfessional = typeof healthProfessionals.$inferSelect;
export type InsertHealthProfessional = typeof healthProfessionals.$inferInsert;

/**
 * Survey Responses table - stores employee survey responses
 */
export const surveyResponses = sqliteTable("surveyResponses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  employeeId: integer("employeeId").notNull().references(() => employees.id),
  responseDate: integer("responseDate", { mode: "timestamp_ms" }).notNull(),
  moodLevel: integer("moodLevel").notNull(),
  stressLevel: integer("stressLevel").notNull(),
  fatigueLevel: integer("fatigueLevel").notNull(),
  workSatisfaction: integer("workSatisfaction").notNull(),
  observations: text("observations"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;

/**
 * Educational Contents table - stores educational materials
 */
export const educationalContents = sqliteTable("educationalContents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title", { length: 255 }).notNull(),
  contentType: text("contentType").notNull(),
  description: text("description").notNull(),
  contentUrl: text("contentUrl", { length: 500 }),
  thumbnailUrl: text("thumbnailUrl", { length: 500 }),
  published: integer("published", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
});

export type EducationalContent = typeof educationalContents.$inferSelect;
export type InsertEducationalContent = typeof educationalContents.$inferInsert;

/**
 * Plans table - stores subscription plans
 */
export const plans = sqliteTable("plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  planName: text("planName", { length: 100 }).notNull(),
  planType: text("planType").notNull(),
  price: integer("price").notNull(),
  billingPeriod: text("billingPeriod").notNull(),
  maxEmployees: integer("maxEmployees"),
  features: text("features"),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull().$defaultFn(() => Date.now()),
});

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = typeof plans.$inferInsert;
