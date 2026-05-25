import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  projects,
  investors,
  wards,
  projectImages,
  projectAmenities,
  projectPricing,
  Project,
  Ward,
  Investor,
  ProjectImage,
  ProjectAmenity,
  ProjectPricing
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
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

// ============ AUTH HELPERS ============

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

// ============ PROJECTS HELPERS ============

export async function getAllProjects(): Promise<Project[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(projects);
  } catch (error) {
    console.error("[Database] Failed to get all projects:", error);
    return [];
  }
}

export async function getProjectById(id: number): Promise<Project | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Database] Failed to get project by id:", error);
    return null;
  }
}

export async function getProjectsByFilters(filters: {
  wardId?: number;
  status?: string;
  projectType?: string;
}): Promise<Project[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    const conditions = [];
    if (filters.wardId) conditions.push(eq(projects.wardId, filters.wardId));
    if (filters.status) conditions.push(eq(projects.status, filters.status as any));
    if (filters.projectType) conditions.push(eq(projects.projectType, filters.projectType as any));
    
    if (conditions.length === 0) {
      return await db.select().from(projects);
    }
    
    return await db.select().from(projects).where(and(...conditions));
  } catch (error) {
    console.error("[Database] Failed to filter projects:", error);
    return [];
  }
}

export async function createProject(data: any): Promise<Project | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(projects).values(data);
    const id = (result as any).insertId;
    return await getProjectById(id);
  } catch (error) {
    console.error("[Database] Failed to create project:", error);
    return null;
  }
}

export async function updateProject(id: number, data: any): Promise<Project | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    await db.update(projects).set(data).where(eq(projects.id, id));
    return await getProjectById(id);
  } catch (error) {
    console.error("[Database] Failed to update project:", error);
    return null;
  }
}

export async function deleteProject(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    // Delete related records first
    await db.delete(projectImages).where(eq(projectImages.projectId, id));
    await db.delete(projectAmenities).where(eq(projectAmenities.projectId, id));
    await db.delete(projectPricing).where(eq(projectPricing.projectId, id));
    
    // Delete project
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete project:", error);
    return false;
  }
}

// ============ WARDS HELPERS ============

export async function getWards(): Promise<Ward[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(wards);
  } catch (error) {
    console.error("[Database] Failed to get wards:", error);
    return [];
  }
}

export async function createWard(data: any): Promise<Ward | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(wards).values(data);
    const id = (result as any).insertId;
    const ward = await db.select().from(wards).where(eq(wards.id, id)).limit(1);
    return ward.length > 0 ? ward[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create ward:", error);
    return null;
  }
}

export async function updateWard(id: number, data: any): Promise<Ward | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    await db.update(wards).set(data).where(eq(wards.id, id));
    const ward = await db.select().from(wards).where(eq(wards.id, id)).limit(1);
    return ward.length > 0 ? ward[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update ward:", error);
    return null;
  }
}

export async function deleteWard(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(wards).where(eq(wards.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete ward:", error);
    return false;
  }
}

// ============ INVESTORS HELPERS ============

export async function getInvestors(): Promise<Investor[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(investors);
  } catch (error) {
    console.error("[Database] Failed to get investors:", error);
    return [];
  }
}

export async function createInvestor(data: any): Promise<Investor | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(investors).values(data);
    const id = (result as any).insertId;
    const investor = await db.select().from(investors).where(eq(investors.id, id)).limit(1);
    return investor.length > 0 ? investor[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create investor:", error);
    return null;
  }
}

export async function updateInvestor(id: number, data: any): Promise<Investor | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    await db.update(investors).set(data).where(eq(investors.id, id));
    const investor = await db.select().from(investors).where(eq(investors.id, id)).limit(1);
    return investor.length > 0 ? investor[0] : null;
  } catch (error) {
    console.error("[Database] Failed to update investor:", error);
    return null;
  }
}

export async function deleteInvestor(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(investors).where(eq(investors.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete investor:", error);
    return false;
  }
}

// ============ PROJECT IMAGES HELPERS ============

export async function getProjectImages(projectId: number): Promise<ProjectImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(projectImages).where(eq(projectImages.projectId, projectId));
  } catch (error) {
    console.error("[Database] Failed to get project images:", error);
    return [];
  }
}

export async function createProjectImage(data: any): Promise<ProjectImage | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(projectImages).values(data);
    const id = (result as any).insertId;
    const image = await db.select().from(projectImages).where(eq(projectImages.id, id)).limit(1);
    return image.length > 0 ? image[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create project image:", error);
    return null;
  }
}

export async function deleteProjectImage(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(projectImages).where(eq(projectImages.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete project image:", error);
    return false;
  }
}

// ============ PROJECT AMENITIES HELPERS ============

export async function getProjectAmenities(projectId: number): Promise<ProjectAmenity[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(projectAmenities).where(eq(projectAmenities.projectId, projectId));
  } catch (error) {
    console.error("[Database] Failed to get project amenities:", error);
    return [];
  }
}

export async function createProjectAmenity(data: any): Promise<ProjectAmenity | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(projectAmenities).values(data);
    const id = (result as any).insertId;
    const amenity = await db.select().from(projectAmenities).where(eq(projectAmenities.id, id)).limit(1);
    return amenity.length > 0 ? amenity[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create project amenity:", error);
    return null;
  }
}

export async function deleteProjectAmenity(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(projectAmenities).where(eq(projectAmenities.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete project amenity:", error);
    return false;
  }
}

// ============ PROJECT PRICING HELPERS ============

export async function getProjectPricingData(projectId: number): Promise<ProjectPricing[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db.select().from(projectPricing).where(eq(projectPricing.projectId, projectId));
  } catch (error) {
    console.error("[Database] Failed to get project pricing:", error);
    return [];
  }
}

export async function createProjectPricing(data: any): Promise<ProjectPricing | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(projectPricing).values(data);
    const id = (result as any).insertId;
    const pricing = await db.select().from(projectPricing).where(eq(projectPricing.id, id)).limit(1);
    return pricing.length > 0 ? pricing[0] : null;
  } catch (error) {
    console.error("[Database] Failed to create project pricing:", error);
    return null;
  }
}

export async function deleteProjectPricing(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  
  try {
    await db.delete(projectPricing).where(eq(projectPricing.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete project pricing:", error);
    return false;
  }
}

// ============ KPI HELPERS ============

export async function getDashboardKPI() {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const allProjects = await db.select().from(projects);
    
    const totalProjects = allProjects.length;
    const totalUnits = allProjects.reduce((sum, p) => sum + p.totalUnits, 0);
    const soldUnits = allProjects.reduce((sum, p) => sum + p.soldUnits, 0);
    const availableUnits = totalUnits - soldUnits;
    const soldPercentage = totalUnits > 0 ? Math.round((soldUnits / totalUnits) * 100) : 0;
    
    const statusBreakdown = {
      opening_sale: allProjects.filter(p => p.status === 'opening_sale').length,
      coming_soon: allProjects.filter(p => p.status === 'coming_soon').length,
      under_construction: allProjects.filter(p => p.status === 'under_construction').length,
      completed: allProjects.filter(p => p.status === 'completed').length,
      handed_over: allProjects.filter(p => p.status === 'handed_over').length,
    };
    
    return {
      totalProjects,
      totalUnits,
      availableUnits,
      soldUnits,
      soldPercentage,
      ...statusBreakdown,
    };
  } catch (error) {
    console.error("[Database] Failed to get KPI:", error);
    return null;
  }
}
