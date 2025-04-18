import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  onClose: () => void;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export function MobileMenu({ onClose, categories }: MobileMenuProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  const menuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { ease: "easeOut", duration: 0.3 } }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={menuVariants}
        className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-white z-50 overflow-y-auto"
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center border-b border-neutral-light">
          <Link href="/">
            <a className="flex items-center" onClick={onClose}>
              <span className="text-2xl font-bold font-['Playfair_Display'] text-primary">REAL<span className="text-secondary">WORLD</span></span>
            </a>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="container mx-auto px-4 py-3">
          <form onSubmit={handleSearch} className="flex items-center bg-neutral-lighter rounded-full overflow-hidden border border-neutral-light px-3 py-1 mb-4">
            <Input 
              type="search" 
              placeholder="Search news..." 
              className="bg-transparent border-none shadow-none focus-visible:ring-0 flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="text-neutral-medium hover:text-primary ml-2">
              <Search size={18} />
            </Button>
          </form>
          
          <ul className="space-y-2">
            <li>
              <Link href="/">
                <a 
                  className={`block px-2 py-1 hover:bg-neutral-lighter rounded ${location === '/' ? 'text-primary font-medium' : ''}`}
                  onClick={onClose}
                >
                  Home
                </a>
              </Link>
            </li>
            {categories.map(category => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`}>
                  <a 
                    className={`block px-2 py-1 hover:bg-neutral-lighter rounded ${location === `/category/${category.slug}` ? 'text-primary font-medium' : ''}`}
                    onClick={onClose}
                  >
                    {category.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-4 border-t border-neutral-light">
            <Link href="/auth/signin">
              <a 
                className="block px-2 py-1 hover:bg-neutral-lighter rounded"
                onClick={onClose}
              >
                Sign In
              </a>
            </Link>
            <Link href="/subscribe">
              <a 
                className="block px-2 py-1 hover:bg-neutral-lighter rounded"
                onClick={onClose}
              >
                Subscribe
              </a>
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
