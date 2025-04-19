import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [location] = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div 
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl z-10"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <span className="text-primary font-bold text-xl font-sans">REAL<span className="text-secondary">WORLD</span></span>
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
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
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <div className="py-2">
              <Link href="/" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  Home
                </a>
              </Link>
              <Link href="/category/world" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/category/world" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  World
                </a>
              </Link>
              <Link href="/category/politics" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/category/politics" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  Politics
                </a>
              </Link>
              <Link href="/category/business" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/category/business" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  Business
                </a>
              </Link>
              <Link href="/category/technology" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/category/technology" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  Technology
                </a>
              </Link>
              <Link href="/category/science" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/category/science" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  Science
                </a>
              </Link>
              <Link href="/category/health" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/category/health" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  Health
                </a>
              </Link>
              <Link href="/category/sports" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/category/sports" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  Sports
                </a>
              </Link>
              <Link href="/category/arts" onClick={onClose}>
                <a className={`block px-4 py-2 ${
                  location === "/category/arts" 
                    ? "text-primary font-medium border-l-4 border-primary bg-gray-50" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-primary font-medium border-l-4 border-transparent hover:border-primary"
                }`}>
                  Arts
                </a>
              </Link>
            </div>
            <div className="border-t border-gray-200 p-4">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-primary">Sign In</a>
                <a href="#" className="px-4 py-2 text-sm font-medium text-center text-white bg-primary rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Subscribe</a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
