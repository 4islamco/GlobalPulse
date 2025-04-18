import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Base API route
  const apiRouter = '/api';
  
  // Get all categories
  app.get(`${apiRouter}/categories`, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  
  // Get articles with optional filters
  app.get(`${apiRouter}/articles`, async (req, res) => {
    try {
      const querySchema = z.object({
        limit: z.string().optional().transform(val => val ? parseInt(val) : undefined),
        category: z.string().optional(),
        featured: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
        trending: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
        editorsPick: z.enum(['true', 'false']).optional().transform(val => val === 'editorsPick')
      });
      
      const query = querySchema.parse(req.query);
      
      const articles = await storage.getArticles(query);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  
  // Get featured articles
  app.get(`${apiRouter}/articles/featured`, async (req, res) => {
    try {
      const articles = await storage.getArticles({ featured: true });
      res.json(articles);
    } catch (error) {
      console.error("Error fetching featured articles:", error);
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });
  
  // Get trending articles
  app.get(`${apiRouter}/articles/trending`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const articles = await storage.getArticles({ trending: true, limit });
      res.json(articles);
    } catch (error) {
      console.error("Error fetching trending articles:", error);
      res.status(500).json({ message: "Failed to fetch trending articles" });
    }
  });
  
  // Get editors' pick articles
  app.get(`${apiRouter}/articles/editors-picks`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const articles = await storage.getArticles({ editorsPick: true, limit });
      res.json(articles);
    } catch (error) {
      console.error("Error fetching editors' pick articles:", error);
      res.status(500).json({ message: "Failed to fetch editors' pick articles" });
    }
  });
  
  // Get articles by category
  app.get(`${apiRouter}/articles/category/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      const articles = await storage.getArticles({ category: slug });
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles by category:", error);
      res.status(500).json({ message: "Failed to fetch articles by category" });
    }
  });
  
  // Get specific article by slug
  app.get(`${apiRouter}/articles/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  
  // Get related articles
  app.get(`${apiRouter}/articles/:slug/related`, async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      const relatedArticles = await storage.getRelatedArticles(article.categoryId, article.id, 3);
      res.json(relatedArticles);
    } catch (error) {
      console.error("Error fetching related articles:", error);
      res.status(500).json({ message: "Failed to fetch related articles" });
    }
  });
  
  // Get breaking news
  app.get(`${apiRouter}/breaking-news`, async (req, res) => {
    try {
      const breakingNews = await storage.getBreakingNews();
      res.json(breakingNews);
    } catch (error) {
      console.error("Error fetching breaking news:", error);
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
