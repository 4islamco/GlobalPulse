import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { MobileMenu } from "@/components/layout/mobile-menu";

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scrolling when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric', 
    year: 'numeric'
  });

  return (
    <header className={`sticky top-0 z-50 bg-white ${isScrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
      {/* Top Bar with Authentication and Social Links */}
      <div className="bg-neutral-darkest text-white px-4 py-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 text-sm">
            <span className="hidden sm:inline-block">{currentDate}</span>
            <Link href="/auth/signin">
              <a className="hover:text-primary-light transition-colors">Sign In</a>
            </Link>
            <Link href="/subscribe">
              <a className="hover:text-primary-light transition-colors">Subscribe</a>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <a href="#" aria-label="Facebook" className="hover:text-primary-light transition-colors">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-primary-light transition-colors">
              <FaTwitter />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-primary-light transition-colors">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-primary-light transition-colors">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation with Logo */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <span className="text-3xl font-bold font-['Playfair_Display'] text-primary">REAL<span className="text-secondary">WORLD</span></span>
          </a>
        </Link>
        
        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center bg-neutral-lighter rounded-full overflow-hidden border border-neutral-light px-3 py-1">
          <form onSubmit={handleSearch} className="flex items-center">
            <Input 
              type="search" 
              placeholder="Search news..." 
              className="bg-transparent border-none shadow-none focus-visible:ring-0 w-48 lg:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="text-neutral-medium hover:text-primary ml-2">
              <Search size={18} />
            </Button>
          </form>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Category Navigation */}
      <nav className="border-t border-neutral-light">
        <div className="container mx-auto overflow-x-auto">
          <ul className="flex px-4 py-2 space-x-1 md:space-x-3 whitespace-nowrap">
            <li>
              <Link href="/">
                <a className={`px-2 py-1 text-sm font-['Roboto_Condensed'] font-medium hover:text-primary transition-colors ${location === '/' ? 'text-primary' : ''}`}>
                  Home
                </a>
              </Link>
            </li>
            {categories?.map((category: any) => (
              <li key={category.id}>
                <Link href={`/category/${category.slug}`}>
                  <a className={`px-2 py-1 text-sm font-['Roboto_Condensed'] font-medium hover:text-primary transition-colors ${location === `/category/${category.slug}` ? 'text-primary' : ''}`}>
                    {category.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile Menu (Only rendered when open) */}
      {isMobileMenuOpen && (
        <MobileMenu 
          onClose={toggleMobileMenu} 
          categories={categories || []}
        />
      )}
    </header>
  );
}
