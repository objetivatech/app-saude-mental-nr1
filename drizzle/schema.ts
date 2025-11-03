import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, date } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with userType to support multiple user profiles.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  userType: mysqlEnum("userType", ["company", "employee", "health_professional", "admin"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Companies table - stores company information
 */
export const companies = mysqlTable("companies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }),
  planId: int("planId").references(() => plans.id),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

/**
 * Employees table - stores employee information
 */
export const employees = mysqlTable("employees", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  companyId: int("companyId").notNull().references(() => companies.id),
  employeeName: varchar("employeeName", { length: 255 }).notNull(),
  employeeEmail: varchar("employeeEmail", { length: 320 }).notNull(),
  department: varchar("department", { length: 100 }),
  position: varchar("position", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = typeof employees.$inferInsert;

/**
 * Health Professionals table - stores health professional information
 */
export const healthProfessionals = mysqlTable("healthProfessionals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  professionalName: varchar("professionalName", { length: 255 }).notNull(),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  registrationNumber: varchar("registrationNumber", { length: 50 }).notNull().unique(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 20 }),
  bio: text("bio"),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HealthProfessional = typeof healthProfessionals.$inferSelect;
export type InsertHealthProfessional = typeof healthProfessionals.$inferInsert;

/**
 * Survey Responses table - stores employee wellness survey responses
 */
export const surveyResponses = mysqlTable("surveyResponses", {
  id: int("id").autoincrement().primaryKey(),
  employeeId: int("employeeId").notNull().references(() => employees.id),
  responseDate: date("responseDate").notNull(),
  moodLevel: int("moodLevel").notNull(), // 1-5 scale
  stressLevel: int("stressLevel").notNull(), // 1-5 scale
  fatigueLevel: int("fatigueLevel").notNull(), // 1-5 scale
  workSatisfaction: int("workSatisfaction").notNull(), // 1-5 scale
  observations: text("observations"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;

/**
 * Educational Contents table - stores educational materials managed by admin
 */
export const educationalContents = mysqlTable("educationalContents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  contentType: mysqlEnum("contentType", ["article", "video", "podcast", "infographic", "guide"]).notNull(),
  description: text("description").notNull(),
  contentUrl: varchar("contentUrl", { length: 500 }),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EducationalContent = typeof educationalContents.$inferSelect;
export type InsertEducationalContent = typeof educationalContents.$inferInsert;

/**
 * Plans table - stores subscription plans for companies
 */
export const plans = mysqlTable("plans", {
  id: int("id").autoincrement().primaryKey(),
  planName: varchar("planName", { length: 100 }).notNull(),
  planType: mysqlEnum("planType", ["basic", "professional", "enterprise"]).notNull(),
  price: int("price").notNull(), // Price in cents
  billingPeriod: mysqlEnum("billingPeriod", ["monthly", "quarterly", "yearly"]).notNull(),
  maxEmployees: int("maxEmployees"),
  features: text("features"), // JSON string with plan features
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Plan = typeof plans.$inferSelect;
export type InsertPlan = typeof plans.$inferInsert;
