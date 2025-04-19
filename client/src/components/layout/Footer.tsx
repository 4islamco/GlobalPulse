import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 font-sans">REAL<span className="text-secondary-400">WORLD</span></h3>
            <p className="text-gray-400 mb-4 text-sm">Delivering accurate, insightful news and analysis from around the globe. Our mission is to inform, contextualize, and illuminate.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
                  className="lucide lucide-twitter"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
                  className="lucide lucide-facebook"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
                  className="lucide lucide-youtube"
                >
                  <path d="M12 19c-2.3 0-6.4-.2-8.1-.6-.7-.2-1.2-.7-1.4-1.4-.3-1.1-.5-3.4-.5-5s.2-3.9.5-5c.2-.7.7-1.2 1.4-1.4C5.6 5.2 9.7 5 12 5s6.4.2 8.1.6c.7.2 1.2.7 1.4 1.4.3 1.1.5 3.4.5 5s-.2 3.9-.5 5c-.2.7-.7 1.2-1.4 1.4-1.7.4-5.8.6-8.1.6 0 0 0 0 0 0z"/>
                  <polygon points="10 15 15 12 10 9 10 15"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
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
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-gray-300">News Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/category/world" className="text-gray-400 hover:text-white transition-colors">World</Link></li>
              <li><Link href="/category/politics" className="text-gray-400 hover:text-white transition-colors">Politics</Link></li>
              <li><Link href="/category/business" className="text-gray-400 hover:text-white transition-colors">Business</Link></li>
              <li><Link href="/category/technology" className="text-gray-400 hover:text-white transition-colors">Technology</Link></li>
              <li><Link href="/category/science" className="text-gray-400 hover:text-white transition-colors">Science</Link></li>
              <li><Link href="/category/health" className="text-gray-400 hover:text-white transition-colors">Health</Link></li>
              <li><Link href="/category/sports" className="text-gray-400 hover:text-white transition-colors">Sports</Link></li>
              <li><Link href="/category/arts" className="text-gray-400 hover:text-white transition-colors">Arts</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-gray-300">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Leadership Team</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Advertise</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Content Licensing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ethics Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-gray-300">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Subscription Help</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">App Support</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</a></li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3 text-gray-300">Download Our App</h4>
              <div className="flex space-x-3">
                <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded transition-colors">
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
                    className="lucide lucide-apple"
                  >
                    <path d="M12 20.94c1.5 0 2.75-.67 3.95-1.89a8.8 8.8 0 0 0 2.05-5.55c0-2.95-1.55-5-3.44-5a2.91 2.91 0 0 0-2.56 1.3 2.91 2.91 0 0 0-2.56-1.3c-1.89 0-3.44 2.05-3.44 5a8.8 8.8 0 0 0 2.05 5.55c1.2 1.22 2.45 1.89 3.95 1.89Z"/>
                    <path d="M17.71 3.04c-1.33.97-1.96 2.23-2.04 3.38a2.91 2.91 0 0 1 2.75-1.42c1.96 0 3.45 2.37 3.45 5.3s-2.55 7.68-3.96 7.68c-1.13 0-2.25-.67-3.33-1.95"/>
                    <path d="M6.22 3.04c1.33.97 1.96 2.23 2.04 3.38A2.92 2.92 0 0 0 5.5 5c-1.95 0-3.44 2.37-3.44 5.3s2.55 7.68 3.95 7.68c1.14 0 2.26-.67 3.34-1.95"/>
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 hover:bg-gray-700 p-2 rounded transition-colors">
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
                    className="lucide lucide-play"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} REALWORLD News Network. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
