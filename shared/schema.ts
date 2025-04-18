import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull().default("#1976D2"), 
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  color: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Authors
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  title: text("title"),
});

export const insertAuthorSchema = createInsertSchema(authors).pick({
  name: true,
  avatar: true,
  title: true,
});

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

// Articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  image: text("image"),
  categoryId: integer("category_id").notNull(),
  authorId: integer("author_id").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  featured: boolean("featured").notNull().default(false),
  trending: boolean("trending").notNull().default(false),
  breaking: boolean("breaking").notNull().default(false),
  exclusive: boolean("exclusive").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  readTime: integer("read_time").notNull().default(5),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  slug: true,
  summary: true,
  content: true,
  image: true,
  categoryId: true,
  authorId: true,
  featured: true,
  trending: true,
  breaking: true,
  exclusive: true,
  readTime: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).pick({
  name: true,
  email: true,
});

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

// Users for our auth system (used by the template)
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
