import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { storagePut } from "./storage";
import {
  getAllProjects,
  getProjectById,
  getProjectsByFilters,
  getDashboardKPI,
  getWards,
  getInvestors,
  getProjectImages,
  getProjectAmenities,
  getProjectPricingData,
  createProject,
  updateProject,
  deleteProject,
  createWard,
  updateWard,
  deleteWard,
  createInvestor,
  updateInvestor,
  deleteInvestor,
  createProjectImage,
  deleteProjectImage,
  createProjectAmenity,
  deleteProjectAmenity,
  createProjectPricing,
  deleteProjectPricing,
} from "./db";

// Admin-only procedure
const adminProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
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
      return {
        success: true,
      } as const;
    }),
  }),

  projects: router({
    // Public procedures
    list: publicProcedure.query(async () => {
      const projectsList = await getAllProjects();
      const wardsList = await getWards();
      const investorsList = await getInvestors();

      return projectsList.map(p => {
        const ward = wardsList.find(w => w.id === p.wardId);
        const investor = investorsList.find(i => i.id === p.investorId);
        return {
          ...p,
          ward: ward?.name || '',
          investorName: investor?.name || '',
        };
      });
    }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const project = await getProjectById(input.id);
        if (!project) return null;

        const images = await getProjectImages(input.id);
        const amenities = await getProjectAmenities(input.id);
        const pricing = await getProjectPricingData(input.id);
        const wardsList = await getWards();
        const investorsList = await getInvestors();

        const ward = wardsList.find(w => w.id === project.wardId);
        const investor = investorsList.find(i => i.id === project.investorId);

        return {
          ...project,
          ward: ward?.name || '',
          investorName: investor?.name || '',
          investorPhone: investor?.phone || '',
          investorEmail: investor?.email || '',
          investorWebsite: investor?.website || '',
          images,
          amenities,
          pricing,
        };
      }),

    filter: publicProcedure
      .input(
        z.object({
          wardId: z.number().optional(),
          status: z.string().optional(),
          projectType: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const projectsList = await getProjectsByFilters(input);
        const wardsList = await getWards();
        const investorsList = await getInvestors();

        return projectsList.map(p => {
          const ward = wardsList.find(w => w.id === p.wardId);
          const investor = investorsList.find(i => i.id === p.investorId);
          return {
            ...p,
            ward: ward?.name || '',
            investorName: investor?.name || '',
          };
        });
      }),

    kpi: publicProcedure.query(async () => {
      return await getDashboardKPI();
    }),

    wards: publicProcedure.query(async () => {
      return await getWards();
    }),

    // Admin procedures
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        address: z.string(),
        wardId: z.number(),
        investorId: z.number(),
        latitude: z.string(),
        longitude: z.string(),
        totalUnits: z.number(),
        soldUnits: z.number().optional(),
        unitArea: z.string().optional(),
        pricePerM2: z.string().optional(),
        status: z.enum(['opening_sale', 'coming_soon', 'completed', 'under_construction', 'handed_over']),
        progress: z.number().optional(),
        completionDate: z.string().optional(),
        projectType: z.enum(['apartment', 'townhouse', 'mixed']).optional(),
      }))
      .mutation(async ({ input }) => {
        return await createProject(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        address: z.string().optional(),
        wardId: z.number().optional(),
        investorId: z.number().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        totalUnits: z.number().optional(),
        soldUnits: z.number().optional(),
        unitArea: z.string().optional(),
        pricePerM2: z.string().optional(),
        status: z.enum(['opening_sale', 'coming_soon', 'completed', 'under_construction', 'handed_over']).optional(),
        progress: z.number().optional(),
        completionDate: z.string().optional(),
        projectType: z.enum(['apartment', 'townhouse', 'mixed']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateProject(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProject(input.id);
      }),
  }),

  wards: router({
    list: publicProcedure.query(async () => {
      return await getWards();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        district: z.string(),
        latitude: z.string(),
        longitude: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await createWard(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        district: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateWard(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteWard(input.id);
      }),
  }),

  investors: router({
    list: publicProcedure.query(async () => {
      return await getInvestors();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createInvestor(input);
      }),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        website: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateInvestor(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteInvestor(input.id);
      }),
  }),

  projectImages: router({
    create: adminProcedure
      .input(z.object({
        projectId: z.number(),
        imageUrl: z.string(),
        caption: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createProjectImage(input);
      }),

    upload: adminProcedure
      .input(z.object({
        projectId: z.number(),
        fileName: z.string(),
        fileType: z.string(),
        base64Data: z.string(),
        caption: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const buffer = Buffer.from(input.base64Data, "base64");
          const fileKey = `projects/${input.projectId}/${Date.now()}-${input.fileName}`;
          const { url } = await storagePut(fileKey, buffer, input.fileType);
          return await createProjectImage({
            projectId: input.projectId,
            imageUrl: url,
            caption: input.caption || "",
            order: 0,
          });
        } catch (error: any) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Upload failed: ${error.message}`,
          });
        }
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProjectImage(input.id);
      }),
  }),

  projectAmenities: router({
    create: adminProcedure
      .input(z.object({
        projectId: z.number(),
        type: z.enum(['school', 'hospital', 'market', 'park', 'transport', 'shopping']),
        name: z.string(),
        distance: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createProjectAmenity(input);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProjectAmenity(input.id);
      }),
  }),

  projectPricing: router({
    create: adminProcedure
      .input(z.object({
        projectId: z.number(),
        unitType: z.string(),
        area: z.string(),
        price: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await createProjectPricing(input);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteProjectPricing(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
