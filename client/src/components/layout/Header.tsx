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
    <header className="sticky top-0 z-50 shadow-md bg-white">
      {/* Top navigation bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button 
            onClick={onOpenMobileMenu}
            className="inline-flex items-center justify-center p-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
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
              className="text-primary font-bold text-2xl font-sans tracking-tight"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              REAL<span className="text-secondary">WORLD</span>
            </motion.span>
          </Link>
        </div>
        
        {/* Desktop nav links - hidden on mobile */}
        <nav className="hidden lg:flex space-x-6">
          <Link href="/" className="px-1 py-2 text-gray-900 font-medium border-b-2 border-primary">Home</Link>
          <Link href="/category/world" className="px-1 py-2 text-gray-700 font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">World</Link>
          <Link href="/category/politics" className="px-1 py-2 text-gray-700 font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Politics</Link>
          <Link href="/category/business" className="px-1 py-2 text-gray-700 font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Business</Link>
          <Link href="/category/technology" className="px-1 py-2 text-gray-700 font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Technology</Link>
          <Link href="/category/science" className="px-1 py-2 text-gray-700 font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Science</Link>
          <Link href="/category/health" className="px-1 py-2 text-gray-700 font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Health</Link>
          <Link href="/category/sports" className="px-1 py-2 text-gray-700 font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Sports</Link>
          <Link href="/category/arts" className="px-1 py-2 text-gray-700 font-medium hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">Arts</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Search button */}
          <button 
            onClick={onOpenSearch} 
            className="p-2 text-gray-500 rounded-md hover:bg-gray-100"
            aria-label="Search"
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
              className="lucide lucide-search"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
          
          {/* User actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <a href="#" className="text-sm font-medium text-gray-700 hover:text-primary">Sign In</a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors">Subscribe</a>
          </div>
        </div>
      </div>
      
      {/* Breaking news ticker */}
      <BreakingNewsTicker />
    </header>
  );
};

export default Header;
