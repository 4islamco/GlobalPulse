import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (maintain existing structure)
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

// Categories for news articles
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories);
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Authors of articles
export const authors = pgTable("authors", {
  id: serial("id").primaryKey(), 
  name: text("name").notNull(),
  title: text("title").notNull(),
  avatarUrl: text("avatar_url").notNull(),
});

export const insertAuthorSchema = createInsertSchema(authors);
export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

// News articles
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: integer("category_id").notNull(),
  authorId: integer("author_id").notNull(),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  isFeatured: boolean("is_featured").notNull().default(false),
  isEditorsPick: boolean("is_editors_pick").notNull().default(false),
  readingTimeMinutes: integer("reading_time_minutes").notNull(),
});

export const insertArticleSchema = createInsertSchema(articles);
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Breaking news for ticker
export const breakingNews = pgTable("breaking_news", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  priority: integer("priority").notNull().default(1),
});

export const insertBreakingNewsSchema = createInsertSchema(breakingNews);
export type InsertBreakingNews = z.infer<typeof insertBreakingNewsSchema>;
export type BreakingNews = typeof breakingNews.$inferSelect;

// Regions for world coverage
export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertRegionSchema = createInsertSchema(regions);
export type InsertRegion = z.infer<typeof insertRegionSchema>;
export type Region = typeof regions.$inferSelect;

// Region news items
export const regionNews = pgTable("region_news", {
  id: serial("id").primaryKey(),
  regionId: integer("region_id").notNull(),
  title: text("title").notNull(),
});

export const insertRegionNewsSchema = createInsertSchema(regionNews);
export type InsertRegionNews = z.infer<typeof insertRegionNewsSchema>;
export type RegionNews = typeof regionNews.$inferSelect;

// Trending topics
export const trendingTopics = pgTable("trending_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  rank: integer("rank").notNull(),
});

export const insertTrendingTopicSchema = createInsertSchema(trendingTopics);
export type InsertTrendingTopic = z.infer<typeof insertTrendingTopicSchema>;
export type TrendingTopic = typeof trendingTopics.$inferSelect;

// Live updates
export const liveUpdates = pgTable("live_updates", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  isRecent: boolean("is_recent").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertLiveUpdateSchema = createInsertSchema(liveUpdates);
export type InsertLiveUpdate = z.infer<typeof insertLiveUpdateSchema>;
export type LiveUpdate = typeof liveUpdates.$inferSelect;

// Daily briefing items
export const dailyBriefingItems = pgTable("daily_briefing_items", {
  id: serial("id").primaryKey(), 
  category: text("category").notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  color: text("color").notNull(),
});

export const insertDailyBriefingItemSchema = createInsertSchema(dailyBriefingItems);
export type InsertDailyBriefingItem = z.infer<typeof insertDailyBriefingItemSchema>;
export type DailyBriefingItem = typeof dailyBriefingItems.$inferSelect;
