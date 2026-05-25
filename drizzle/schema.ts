import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Wards/Districts table for Đà Nẵng administrative divisions
 */
export const wards = mysqlTable("wards", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  district: varchar("district", { length: 255 }).notNull(),
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Ward = typeof wards.$inferSelect;
export type InsertWard = typeof wards.$inferInsert;

/**
 * Investors table
 */
export const investors = mysqlTable("investors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().default(''),
  email: varchar("email", { length: 255 }).notNull().default(''),
  website: varchar("website", { length: 255 }).notNull().default(''),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Investor = typeof investors.$inferSelect;
export type InsertInvestor = typeof investors.$inferInsert;

/**
 * Projects table - NOXH projects in Đà Nẵng
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull().default(''),
  address: varchar("address", { length: 255 }).notNull(),
  wardId: int("wardId").notNull(),
  investorId: int("investorId").notNull(),
  latitude: varchar("latitude", { length: 50 }).notNull(),
  longitude: varchar("longitude", { length: 50 }).notNull(),
  totalUnits: int("totalUnits").notNull(),
  soldUnits: int("soldUnits").default(0).notNull(),
  unitArea: varchar("unitArea", { length: 100 }).notNull().default(''),
  pricePerM2: varchar("pricePerM2", { length: 100 }).notNull().default(''),
  status: mysqlEnum("status", ["opening_sale", "coming_soon", "completed", "under_construction", "handed_over"]).notNull(),
  progress: int("progress").default(0).notNull(),
  completionDate: varchar("completionDate", { length: 50 }).notNull().default(''),
  projectType: mysqlEnum("projectType", ["apartment", "townhouse", "mixed"]).default("apartment").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Project images table
 */
export const projectImages = mysqlTable("projectImages", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  caption: varchar("caption", { length: 255 }).notNull().default(''),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectImage = typeof projectImages.$inferSelect;
export type InsertProjectImage = typeof projectImages.$inferInsert;

/**
 * Project amenities/utilities nearby
 */
export const projectAmenities = mysqlTable("projectAmenities", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  type: mysqlEnum("type", ["school", "hospital", "market", "park", "transport", "shopping"]).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  distance: varchar("distance", { length: 100 }).notNull().default(''),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectAmenity = typeof projectAmenities.$inferSelect;
export type InsertProjectAmenity = typeof projectAmenities.$inferInsert;

/**
 * Project pricing tiers
 */
export const projectPricing = mysqlTable("projectPricing", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  unitType: varchar("unitType", { length: 100 }).notNull(),
  area: varchar("area", { length: 50 }).notNull(),
  price: varchar("price", { length: 100 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectPricing = typeof projectPricing.$inferSelect;
export type InsertProjectPricing = typeof projectPricing.$inferInsert;
