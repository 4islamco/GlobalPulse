import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { NewsletterSignup } from "@/components/sidebar/newsletter-signup";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export function Footer() {
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-darkest text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About & Contact */}
          <div>
            <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">
              REAL<span className="text-secondary">WORLD</span>
            </h3>
            <p className="text-neutral-light mb-4">
              Delivering accurate, unbiased news from around the globe since 2015.
            </p>
            <ul className="space-y-2 text-neutral-light">
              <li className="flex items-center">
                <MdEmail className="mr-2 text-secondary" />
                <a href="mailto:contact@realworld.news" className="hover:text-white transition-colors">
                  contact@realworld.news
                </a>
              </li>
              <li className="flex items-center">
                <MdPhone className="mr-2 text-secondary" />
                <a href="tel:+11234567890" className="hover:text-white transition-colors">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-start">
                <MdLocationOn className="mr-2 mt-1 text-secondary" />
                <span>123 Media Plaza, New York, NY 10001, USA</span>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories?.map((category: any) => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`}>
                    <a className="text-neutral-light hover:text-white transition-colors">
                      {category.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-neutral-light hover:text-white transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/team">
                  <a className="text-neutral-light hover:text-white transition-colors">Editorial Team</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-light hover:text-white transition-colors">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/advertise">
                  <a className="text-neutral-light hover:text-white transition-colors">Advertise</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-neutral-light hover:text-white transition-colors">Careers</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-neutral-light hover:text-white transition-colors">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-neutral-light hover:text-white transition-colors">Terms of Service</a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Subscribe */}
          <div>
            <h3 className="text-xl font-['Playfair_Display'] font-bold mb-4">Subscribe</h3>
            <p className="text-neutral-light mb-4">Get the latest news and updates delivered to your inbox.</p>
            <NewsletterSignup variant="dark" />
            
            <div className="flex space-x-3 mt-4">
              <a 
                href="#" 
                className="bg-neutral-dark hover:bg-neutral-medium h-10 w-10 rounded-full flex items-center justify-center transition-colors" 
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a 
                href="#" 
                className="bg-neutral-dark hover:bg-neutral-medium h-10 w-10 rounded-full flex items-center justify-center transition-colors" 
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a 
                href="#" 
                className="bg-neutral-dark hover:bg-neutral-medium h-10 w-10 rounded-full flex items-center justify-center transition-colors" 
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a 
                href="#" 
                className="bg-neutral-dark hover:bg-neutral-medium h-10 w-10 rounded-full flex items-center justify-center transition-colors" 
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="pt-6 border-t border-neutral-dark text-neutral-light text-sm flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>&copy; {currentYear} REALWORLD News. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="/privacy">
              <a className="hover:text-white transition-colors">Privacy Policy</a>
            </Link>
            <Link href="/terms">
              <a className="hover:text-white transition-colors">Terms of Service</a>
            </Link>
            <Link href="/cookie-policy">
              <a className="hover:text-white transition-colors">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
