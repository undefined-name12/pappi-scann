import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Custom schema for the application

export const ipSchema = z.object({
  ip: z.string(),
  port: z.string(),
  timestamp: z.string().optional(),
});

export const enrichedSchema = z.object({
  ip: z.string(),
  port: z.string(),
  hostname: z.string().optional(),
  organization: z.string().optional(),
  country: z.string().optional(),
  banner: z.string().optional(),
});

export const serviceSchema = z.object({
  port: z.string(),
  service: z.string(),
});

export const addServiceSchema = z.object({
  port: z.string().min(1, "Port is required"),
  service: z.string().min(1, "Service name is required"),
});

export type IP = z.infer<typeof ipSchema>;
export type Enriched = z.infer<typeof enrichedSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type AddService = z.infer<typeof addServiceSchema>;
