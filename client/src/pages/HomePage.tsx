import React, { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryNav } from '@/components/home/CategoryNav';
import { TrendingNews } from '@/components/home/TrendingNews';
import { LatestNews } from '@/components/home/LatestNews';
import { FeaturedAnalysis } from '@/components/home/FeaturedAnalysis';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  const handleCategorySelect = (categorySlug: string | null) => {
    setSelectedCategorySlug(categorySlug);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <CategoryNav 
        activeCategorySlug={selectedCategorySlug} 
        onSelectCategory={handleCategorySelect} 
      />
      <TrendingNews />
      <LatestNews categorySlug={selectedCategorySlug} />
      <FeaturedAnalysis />
      <NewsletterSignup />
    </motion.div>
  );
};

export default HomePage;
