import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Company-only procedure
const companyProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.userType !== 'company') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Company access required' });
  }
  return next({ ctx });
});

// Employee-only procedure
const employeeProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.userType !== 'employee') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Employee access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateUserType: protectedProcedure
      .input(z.object({
        userType: z.enum(["company", "employee", "health_professional", "admin"])
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserType(ctx.user.id, input.userType);
        return { success: true };
      }),
    
    // Admin authentication with email/password
    registerAdmin: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string().min(1),
        secretKey: z.string(), // Secret key to prevent unauthorized admin registration
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify secret key (should be set in environment)
        if (input.secretKey !== process.env.ADMIN_REGISTRATION_SECRET) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid secret key' });
        }

        // Check if email already exists
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Email already registered' });
        }

        // Hash password and create admin user
        const { hashPassword } = await import('./auth');
        const passwordHash = hashPassword(input.password);
        await db.createAdminUser(input.email, passwordHash, input.name);

        return { success: true, message: 'Admin user created successfully' };
      }),

    loginAdmin: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get user by email
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.passwordHash) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }

        // Verify password
        const { verifyPassword } = await import('./auth');
        const isValid = verifyPassword(input.password, user.passwordHash);
        if (!isValid) {
          throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        }

        // Create session (reuse existing OAuth session logic)
        const { signJWT } = await import('./_core/jwt');
        const token = await signJWT({ openId: user.openId! });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

        return { 
          success: true, 
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            userType: user.userType,
          }
        };
      }),
  }),

  // ============= COMPANY ROUTES =============
  company: router({
    register: protectedProcedure
      .input(z.object({
        companyName: z.string().min(1),
        cnpj: z.string().min(14).max(18),
        contactEmail: z.string().email(),
        contactPhone: z.string().optional(),
        planId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if company already exists for this user
        const existing = await db.getCompanyByUserId(ctx.user.id);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Company already registered for this user' });
        }

        await db.createCompany({
          userId: ctx.user.id,
          ...input,
        });

        // Update user type
        await db.updateUserType(ctx.user.id, 'company');

        return { success: true };
      }),

    getMyCompany: companyProcedure.query(async ({ ctx }) => {
      const company = await db.getCompanyByUserId(ctx.user.id);
      if (!company) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Company not found' });
      }
      return company;
    }),

    getEmployees: companyProcedure.query(async ({ ctx }) => {
      const company = await db.getCompanyByUserId(ctx.user.id);
      if (!company) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Company not found' });
      }
      return await db.getEmployeesByCompanyId(company.id);
    }),

    getWellnessStats: companyProcedure
      .input(z.object({
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .query(async ({ ctx, input }) => {
        const company = await db.getCompanyByUserId(ctx.user.id);
        if (!company) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Company not found' });
        }
        return await db.getCompanyWellnessStats(company.id, input.startDate, input.endDate);
      }),

    getSurveyResponses: companyProcedure.query(async ({ ctx }) => {
      const company = await db.getCompanyByUserId(ctx.user.id);
      if (!company) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Company not found' });
      }
      return await db.getSurveyResponsesByCompanyId(company.id);
    }),
  }),

  // ============= EMPLOYEE ROUTES =============
  employee: router({
    register: protectedProcedure
      .input(z.object({
        companyId: z.number(),
        employeeName: z.string().min(1),
        employeeEmail: z.string().email(),
        department: z.string().optional(),
        position: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if employee already exists for this user
        const existing = await db.getEmployeeByUserId(ctx.user.id);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Employee already registered for this user' });
        }

        // Verify company exists
        const company = await db.getCompanyById(input.companyId);
        if (!company) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Company not found' });
        }

        await db.createEmployee({
          userId: ctx.user.id,
          ...input,
        });

        // Update user type
        await db.updateUserType(ctx.user.id, 'employee');

        return { success: true };
      }),

    getMyProfile: employeeProcedure.query(async ({ ctx }) => {
      const employee = await db.getEmployeeByUserId(ctx.user.id);
      if (!employee) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Employee not found' });
      }
      return employee;
    }),

    submitSurvey: employeeProcedure
      .input(z.object({
        moodLevel: z.number().min(1).max(5),
        stressLevel: z.number().min(1).max(5),
        fatigueLevel: z.number().min(1).max(5),
        workSatisfaction: z.number().min(1).max(5),
        observations: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const employee = await db.getEmployeeByUserId(ctx.user.id);
        if (!employee) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Employee not found' });
        }

        await db.createSurveyResponse({
          employeeId: employee.id,
          responseDate: new Date(),
          ...input,
        });

        return { success: true };
      }),

    getMySurveyHistory: employeeProcedure.query(async ({ ctx }) => {
      const employee = await db.getEmployeeByUserId(ctx.user.id);
      if (!employee) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Employee not found' });
      }
      return await db.getSurveyResponsesByEmployeeId(employee.id);
    }),
  }),

  // ============= HEALTH PROFESSIONAL ROUTES =============
  healthProfessional: router({
    register: protectedProcedure
      .input(z.object({
        professionalName: z.string().min(1),
        specialty: z.string().min(1),
        registrationNumber: z.string().min(1),
        contactEmail: z.string().email(),
        contactPhone: z.string().optional(),
        bio: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if professional already exists for this user
        const existing = await db.getHealthProfessionalByUserId(ctx.user.id);
        if (existing) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Health professional already registered for this user' });
        }

        await db.createHealthProfessional({
          userId: ctx.user.id,
          ...input,
        });

        // Update user type
        await db.updateUserType(ctx.user.id, 'health_professional');

        return { success: true };
      }),

    getAll: publicProcedure.query(async () => {
      return await db.getAllHealthProfessionals();
    }),
  }),

  // ============= EDUCATIONAL CONTENT ROUTES =============
  content: router({
    getPublished: publicProcedure.query(async () => {
      return await db.getPublishedEducationalContents();
    }),

    getAll: adminProcedure.query(async () => {
      return await db.getAllEducationalContents();
    }),

    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        contentType: z.enum(["article", "video", "podcast", "infographic", "guide"]),
        description: z.string().min(1),
        contentUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        published: z.boolean().default(false),
      }))
      .mutation(async ({ input }) => {
        await db.createEducationalContent(input);
        return { success: true };
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        contentType: z.enum(["article", "video", "podcast", "infographic", "guide"]).optional(),
        description: z.string().min(1).optional(),
        contentUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateEducationalContent(id, updates);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteEducationalContent(input.id);
        return { success: true };
      }),
  }),

  // ============= ADMIN ROUTES =============
  admin: router({
    // User Management
    createCompanyUser: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        companyName: z.string().min(1),
        cnpj: z.string().min(14).max(18),
        contactEmail: z.string().email(),
        contactPhone: z.string().optional(),
        planId: z.number().optional(),
        approved: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        // This would require creating user first, then company
        // For now, return success - full implementation needed
        return { success: true, message: "Funcionalidade em desenvolvimento" };
      }),

    createEmployeeUser: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        companyId: z.number(),
        employeeName: z.string().min(1),
        employeeEmail: z.string().email(),
        department: z.string().optional(),
        position: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return { success: true, message: "Funcionalidade em desenvolvimento" };
      }),

    createProfessionalUser: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        professionalName: z.string().min(1),
        specialty: z.string().min(1),
        registrationNumber: z.string().min(1),
        contactEmail: z.string().email(),
        contactPhone: z.string().optional(),
        bio: z.string().optional(),
        approved: z.boolean().default(true),
      }))
      .mutation(async ({ input }) => {
        return { success: true, message: "Funcionalidade em desenvolvimento" };
      }),

    getAllUsers: adminProcedure.query(async () => {
      const allUsers = await db.getAllUsers();
      return allUsers;
    }),

    deleteUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteUser(input.userId);
        return { success: true };
      }),
    getPendingCompanies: adminProcedure.query(async () => {
      return await db.getPendingCompanies();
    }),

    approveCompany: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.approveCompany(input.id);
        return { success: true };
      }),

    getPendingProfessionals: adminProcedure.query(async () => {
      return await db.getPendingHealthProfessionals();
    }),

    approveProfessional: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.approveHealthProfessional(input.id);
        return { success: true };
      }),

    getAllCompanies: adminProcedure.query(async () => {
      return await db.getAllCompanies();
    }),
  }),

  // ============= PLAN ROUTES =============
  plan: router({
    getAll: publicProcedure.query(async () => {
      return await db.getAllPlans();
    }),

    create: adminProcedure
      .input(z.object({
        planName: z.string().min(1),
        planType: z.enum(["basic", "professional", "enterprise"]),
        price: z.number().min(0),
        billingPeriod: z.enum(["monthly", "quarterly", "yearly"]),
        maxEmployees: z.number().optional(),
        features: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createPlan(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
