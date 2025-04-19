import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix for all routes
  const apiPrefix = "/api";

  // Get all categories
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get(`${apiPrefix}/categories/:slug`, async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get all articles
  app.get(`${apiPrefix}/articles`, async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  // Get article by ID
  app.get(`${apiPrefix}/articles/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      
      const article = await storage.getArticleById(id);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Get articles by category
  app.get(`${apiPrefix}/categories/:categoryId/articles`, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const articles = await storage.getArticlesByCategory(categoryId);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles for category" });
    }
  });

  // Get featured articles
  app.get(`${apiPrefix}/featured-articles`, async (req, res) => {
    try {
      const articles = await storage.getFeaturedArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured articles" });
    }
  });

  // Get editors picks
  app.get(`${apiPrefix}/editors-picks`, async (req, res) => {
    try {
      const articles = await storage.getEditorsPicks();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch editors picks" });
    }
  });

  // Get latest articles with optional limit
  app.get(`${apiPrefix}/latest-articles`, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const articles = await storage.getLatestArticles(limit);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest articles" });
    }
  });

  // Get all authors
  app.get(`${apiPrefix}/authors`, async (req, res) => {
    try {
      const authors = await storage.getAuthors();
      res.json(authors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch authors" });
    }
  });

  // Get author by ID
  app.get(`${apiPrefix}/authors/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid author ID" });
      }
      
      const author = await storage.getAuthorById(id);
      
      if (!author) {
        return res.status(404).json({ message: "Author not found" });
      }
      
      res.json(author);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch author" });
    }
  });

  // Get breaking news
  app.get(`${apiPrefix}/breaking-news`, async (req, res) => {
    try {
      const breakingNews = await storage.getBreakingNews();
      res.json(breakingNews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });

  // Get regions
  app.get(`${apiPrefix}/regions`, async (req, res) => {
    try {
      const regions = await storage.getRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });

  // Get region news
  app.get(`${apiPrefix}/regions/:id/news`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid region ID" });
      }
      
      const news = await storage.getRegionNews(id);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch region news" });
    }
  });

  // Get trending topics
  app.get(`${apiPrefix}/trending-topics`, async (req, res) => {
    try {
      const topics = await storage.getTrendingTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending topics" });
    }
  });

  // Get live updates
  app.get(`${apiPrefix}/live-updates`, async (req, res) => {
    try {
      const updates = await storage.getLiveUpdates();
      res.json(updates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live updates" });
    }
  });

  // Get daily briefing items
  app.get(`${apiPrefix}/daily-briefing`, async (req, res) => {
    try {
      const items = await storage.getDailyBriefingItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily briefing" });
    }
  });

  // Create an article (example POST request)
  app.post(`${apiPrefix}/articles`, async (req, res) => {
    try {
      const articleSchema = z.object({
        title: z.string().min(1),
        summary: z.string().min(1),
        content: z.string().min(1),
        imageUrl: z.string().url(),
        categoryId: z.number().int().positive(),
        authorId: z.number().int().positive(),
        publishedAt: z.string().optional(),
        isFeatured: z.boolean().optional(),
        isEditorsPick: z.boolean().optional(),
        readingTimeMinutes: z.number().int().positive()
      });
      
      const validatedData = articleSchema.parse(req.body);
      const article = await storage.createArticle({
        ...validatedData,
        publishedAt: validatedData.publishedAt || new Date().toISOString(),
        isFeatured: validatedData.isFeatured || false,
        isEditorsPick: validatedData.isEditorsPick || false
      });
      
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  // Create a newsletter subscription
  app.post(`${apiPrefix}/newsletter-subscribe`, async (req, res) => {
    try {
      const subscriptionSchema = z.object({
        email: z.string().email(),
        frequency: z.enum(["daily", "weekly", "monthly"])
      });
      
      const validatedData = subscriptionSchema.parse(req.body);
      
      // In a real implementation, this would store the subscription in a database
      // For now, we'll just return a success response
      
      res.status(200).json({ 
        message: "Subscription successful", 
        data: { 
          email: validatedData.email, 
          frequency: validatedData.frequency 
        } 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
