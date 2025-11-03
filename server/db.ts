import { eq, and, desc, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  companies, InsertCompany,
  employees, InsertEmployee,
  healthProfessionals, InsertHealthProfessional,
  surveyResponses, InsertSurveyResponse,
  educationalContents, InsertEducationalContent,
  plans, InsertPlan
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= USER OPERATIONS =============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (user.userType !== undefined) {
      values.userType = user.userType;
      updateSet.userType = user.userType;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserType(userId: number, userType: "company" | "employee" | "health_professional" | "admin") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ userType }).where(eq(users.id, userId));
}

// ============= COMPANY OPERATIONS =============

export async function createCompany(company: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(companies).values(company);
  return result;
}

export async function getCompanyByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(companies).where(eq(companies.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllCompanies() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(companies).orderBy(desc(companies.createdAt));
}

export async function getPendingCompanies() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(companies).where(eq(companies.approved, false)).orderBy(desc(companies.createdAt));
}

export async function approveCompany(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(companies).set({ approved: true }).where(eq(companies.id, id));
}

// ============= EMPLOYEE OPERATIONS =============

export async function createEmployee(employee: InsertEmployee) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(employees).values(employee);
  return result;
}

export async function getEmployeeByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(employees).where(eq(employees.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getEmployeesByCompanyId(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(employees).where(eq(employees.companyId, companyId)).orderBy(desc(employees.createdAt));
}

// ============= HEALTH PROFESSIONAL OPERATIONS =============

export async function createHealthProfessional(professional: InsertHealthProfessional) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(healthProfessionals).values(professional);
  return result;
}

export async function getHealthProfessionalByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(healthProfessionals).where(eq(healthProfessionals.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllHealthProfessionals() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(healthProfessionals).where(eq(healthProfessionals.approved, true)).orderBy(desc(healthProfessionals.createdAt));
}

export async function getPendingHealthProfessionals() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(healthProfessionals).where(eq(healthProfessionals.approved, false)).orderBy(desc(healthProfessionals.createdAt));
}

export async function approveHealthProfessional(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(healthProfessionals).set({ approved: true }).where(eq(healthProfessionals.id, id));
}

// ============= SURVEY RESPONSE OPERATIONS =============

export async function createSurveyResponse(response: InsertSurveyResponse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(surveyResponses).values(response);
  return result;
}

export async function getSurveyResponsesByEmployeeId(employeeId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(surveyResponses).where(eq(surveyResponses.employeeId, employeeId)).orderBy(desc(surveyResponses.responseDate));
}

export async function getSurveyResponsesByCompanyId(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      id: surveyResponses.id,
      employeeId: surveyResponses.employeeId,
      responseDate: surveyResponses.responseDate,
      moodLevel: surveyResponses.moodLevel,
      stressLevel: surveyResponses.stressLevel,
      fatigueLevel: surveyResponses.fatigueLevel,
      workSatisfaction: surveyResponses.workSatisfaction,
      observations: surveyResponses.observations,
      createdAt: surveyResponses.createdAt,
      employeeName: employees.employeeName,
      department: employees.department,
    })
    .from(surveyResponses)
    .innerJoin(employees, eq(surveyResponses.employeeId, employees.id))
    .where(eq(employees.companyId, companyId))
    .orderBy(desc(surveyResponses.responseDate));

  return result;
}

export async function getCompanyWellnessStats(companyId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return null;

  let conditions = [eq(employees.companyId, companyId)];
  
  if (startDate) {
    conditions.push(gte(surveyResponses.responseDate, startDate));
  }
  if (endDate) {
    conditions.push(lte(surveyResponses.responseDate, endDate));
  }

  const result = await db
    .select({
      avgMood: sql<number>`AVG(${surveyResponses.moodLevel})`,
      avgStress: sql<number>`AVG(${surveyResponses.stressLevel})`,
      avgFatigue: sql<number>`AVG(${surveyResponses.fatigueLevel})`,
      avgSatisfaction: sql<number>`AVG(${surveyResponses.workSatisfaction})`,
      totalResponses: sql<number>`COUNT(*)`,
    })
    .from(surveyResponses)
    .innerJoin(employees, eq(surveyResponses.employeeId, employees.id))
    .where(and(...conditions));

  return result.length > 0 ? result[0] : null;
}

// ============= EDUCATIONAL CONTENT OPERATIONS =============

export async function createEducationalContent(content: InsertEducationalContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(educationalContents).values(content);
  return result;
}

export async function getAllEducationalContents() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(educationalContents).orderBy(desc(educationalContents.createdAt));
}

export async function getPublishedEducationalContents() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(educationalContents).where(eq(educationalContents.published, true)).orderBy(desc(educationalContents.createdAt));
}

export async function updateEducationalContent(id: number, content: Partial<InsertEducationalContent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(educationalContents).set(content).where(eq(educationalContents.id, id));
}

export async function deleteEducationalContent(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(educationalContents).where(eq(educationalContents.id, id));
}

// ============= PLAN OPERATIONS =============

export async function createPlan(plan: InsertPlan) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(plans).values(plan);
  return result;
}

export async function getAllPlans() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(plans).where(eq(plans.active, true)).orderBy(plans.price);
}

export async function getPlanById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}
