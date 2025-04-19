export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  categoryId: number;
  authorId: number;
  publishedAt: string;
  isFeatured: boolean;
  isEditorsPick: boolean;
  readingTimeMinutes: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
}

export interface Author {
  id: number;
  name: string;
  title: string;
  avatarUrl: string;
}

export interface BreakingNews {
  id: number;
  content: string;
  createdAt: string;
  priority: number;
}

export interface Region {
  id: number;
  name: string;
  news: RegionNews[];
}

export interface RegionNews {
  id: number;
  title: string;
}

export interface TrendingTopic {
  id: number;
  title: string;
  rank: number;
}

export interface LiveUpdate {
  id: number;
  content: string;
  isRecent: boolean;
  createdAt: string;
}

export interface DailyBriefingItem {
  id: number;
  category: string;
  title: string;
  summary: string;
  color: string;
}
