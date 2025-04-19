import { useState } from "react";
import { Link } from "wouter";
import BreakingNewsTicker from "../shared/BreakingNewsTicker";
import { motion } from "framer-motion";

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

const Header = ({ onOpenSearch, onOpenMobileMenu }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 shadow-lg bg-background">
      {/* Top navigation bar */}
      <div className="px-4 py-3 bg-background border-b border-white/10 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button 
            onClick={onOpenMobileMenu}
            className="inline-flex items-center justify-center p-2 text-white/80 rounded-md lg:hidden hover:bg-white/10 border border-white/20 transition-colors"
            aria-label="Open menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </button>
          
          {/* Logo */}
          <Link href="/" className="flex items-center ml-2 lg:ml-0">
            <motion.span 
              className="gradient-text font-bold text-2xl font-sans tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              REAL<span className="world-logo">WORLD</span>
            </motion.span>
          </Link>
        </div>
        
        {/* Desktop nav links - hidden on mobile */}
        <nav className="hidden lg:flex space-x-6">
          <Link href="/" className="px-1 py-2 text-white font-medium border-b-2 border-secondary">Home</Link>
          <Link href="/category/world" className="px-1 py-2 text-white/80 font-medium hover:text-white transition-colors border-b-2 border-transparent hover:border-secondary">World</Link>
          <Link href="/category/politics" className="px-1 py-2 text-white/80 font-medium hover:text-white transition-colors border-b-2 border-transparent hover:border-secondary">Politics</Link>
          <Link href="/category/business" className="px-1 py-2 text-white/80 font-medium hover:text-white transition-colors border-b-2 border-transparent hover:border-secondary">Business</Link>
          <Link href="/category/technology" className="px-1 py-2 text-white/80 font-medium hover:text-white transition-colors border-b-2 border-transparent hover:border-secondary">Technology</Link>
          <Link href="/category/science" className="px-1 py-2 text-white/80 font-medium hover:text-white transition-colors border-b-2 border-transparent hover:border-secondary">Science</Link>
          <Link href="/category/health" className="px-1 py-2 text-white/80 font-medium hover:text-white transition-colors border-b-2 border-transparent hover:border-secondary">Health</Link>
          <Link href="/category/sports" className="px-1 py-2 text-white/80 font-medium hover:text-white transition-colors border-b-2 border-transparent hover:border-secondary">Sports</Link>
          <Link href="/category/arts" className="px-1 py-2 text-white/80 font-medium hover:text-white transition-colors border-b-2 border-transparent hover:border-secondary">Arts</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Search button */}
          <button 
            onClick={onOpenSearch} 
            className="p-2 text-white/80 rounded-md hover:bg-white/10 border border-white/20 transition-colors"
            aria-label="Search"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
          
          {/* User actions */}
          <div className="hidden sm:flex items-center space-x-4">
            <a href="#" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Sign In</a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-white gradient-red-blueberry rounded-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-all shadow-md border border-white/20">Subscribe</a>
          </div>
        </div>
      </div>
      
      {/* Breaking news ticker */}
      <BreakingNewsTicker />
    </header>
  );
};

export default Header;
