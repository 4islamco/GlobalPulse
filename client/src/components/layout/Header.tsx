import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Search, User } from 'lucide-react';
import { NewsTicker } from '@/components/ui/news-ticker';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [location] = useLocation();

  // Get categories for navigation
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get breaking news for ticker
  const { data: breakingNews } = useQuery({
    queryKey: ['/api/articles/breaking'],
  });

  // Process breaking news for ticker
  const breakingNewsItems = breakingNews?.map(article => ({
    id: article.id,
    text: article.title,
    label: 'BREAKING'
  })) || [];

  // Close mobile menu on location change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar with Logo and Search */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-primary font-headline font-black text-3xl tracking-tight">
              REAL<span className="text-secondary">WORLD</span>
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className={`font-medium ${location === '/' ? 'text-primary' : 'text-neutral-400 hover:text-primary'} transition-colors`}>
                Home
              </a>
            </Link>
            
            {categories?.map(category => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <a className={`font-medium ${location === `/category/${category.slug}` ? 'text-primary' : 'text-neutral-400 hover:text-primary'} transition-colors`}>
                  {category.name}
                </a>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-neutral-400" />
            </button>
            
            {/* User Account */}
            <button className="p-2 rounded-full hover:bg-neutral-100 transition-colors" aria-label="User account">
              <User className="h-5 w-5 text-neutral-400" />
            </button>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-neutral-400" />
              ) : (
                <Menu className="h-5 w-5 text-neutral-400" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden py-3 border-t border-neutral-200 animate-fade-in`}>
          <div className="flex flex-col space-y-3">
            <Link href="/">
              <a className={`font-medium px-2 py-1 ${location === '/' ? 'text-primary' : 'text-neutral-400 hover:text-primary'} transition-colors`}>
                Home
              </a>
            </Link>
            
            {categories?.map(category => (
              <Link key={category.id} href={`/category/${category.slug}`}>
                <a className={`font-medium px-2 py-1 ${location === `/category/${category.slug}` ? 'text-primary' : 'text-neutral-400 hover:text-primary'} transition-colors`}>
                  {category.name}
                </a>
              </Link>
            ))}
          </div>
        </nav>
        
        {/* Search Overlay */}
        <div className={`${searchOpen ? 'block' : 'hidden'} absolute inset-x-0 top-full bg-white shadow-lg p-4 animate-fade-in`}>
          <div className="container mx-auto">
            <div className="flex items-center border-b-2 border-primary">
              <Search className="h-5 w-5 text-neutral-300 mr-2" />
              <input 
                type="text" 
                placeholder="Search for news..." 
                className="w-full py-2 focus:outline-none text-neutral-500"
                autoFocus
              />
              <button 
                onClick={() => setSearchOpen(false)}
                className="ml-2 text-neutral-300 hover:text-primary"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-sm uppercase text-neutral-300 mb-2">Trending Searches</h4>
              <div className="flex flex-wrap gap-2">
                <Link href="/search?q=Climate+Change">
                  <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-400 hover:bg-primary hover:text-white transition-colors">
                    Climate Change
                  </a>
                </Link>
                <Link href="/search?q=Economic+Summit">
                  <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-400 hover:bg-primary hover:text-white transition-colors">
                    Economic Summit
                  </a>
                </Link>
                <Link href="/search?q=Elections+2024">
                  <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-400 hover:bg-primary hover:text-white transition-colors">
                    Elections 2024
                  </a>
                </Link>
                <Link href="/search?q=Tech+Innovation">
                  <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm text-neutral-400 hover:bg-primary hover:text-white transition-colors">
                    Tech Innovation
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Breaking News Ticker */}
      {breakingNewsItems.length > 0 && (
        <div className="bg-primary text-white py-2 overflow-hidden">
          <NewsTicker 
            items={breakingNewsItems}
            labelClassName="bg-accent text-neutral-500"
          />
        </div>
      )}
    </header>
  );
};
