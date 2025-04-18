import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Category schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  color: text("color"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  color: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Author schema
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role"),
  avatar: text("avatar"),
});

export const insertAuthorSchema = createInsertSchema(authors).pick({
  name: true,
  role: true,
  avatar: true,
});

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

// Article schema
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content"),
  image: text("image"),
  categoryId: integer("category_id").notNull(),
  authorId: integer("author_id").notNull(),
  published: boolean("published").default(true),
  featured: boolean("featured").default(false),
  trending: boolean("trending").default(false),
  editorsPick: boolean("editors_pick").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  readTime: integer("read_time").default(5),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  image: true,
  categoryId: true,
  authorId: true,
  published: true,
  featured: true,
  trending: true,
  editorsPick: true,
  readTime: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Breaking news schema
export const breakingNews = pgTable("breaking_news", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  active: boolean("active").default(true),
  priority: integer("priority").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBreakingNewsSchema = createInsertSchema(breakingNews).pick({
  text: true,
  active: true,
  priority: true,
});

export type InsertBreakingNews = z.infer<typeof insertBreakingNewsSchema>;
export type BreakingNews = typeof breakingNews.$inferSelect;

// Extended types for frontend
export type ArticleWithRelations = Article & {
  category: Category;
  author: Author;
};
