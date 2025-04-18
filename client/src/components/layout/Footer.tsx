import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';

export const Footer = () => {
  // Get categories for navigation
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  return (
    <footer className="bg-neutral-500 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & About */}
          <div>
            <h2 className="font-headline font-black text-2xl mb-4">
              REAL<span className="text-primary">WORLD</span>
            </h2>
            <p className="text-neutral-200 mb-4">
              Delivering accurate, unbiased news and insightful analysis on global events that matter.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-200 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="font-medium text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              {categories?.map(category => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`}>
                    <a className="text-neutral-200 hover:text-white transition-colors">
                      {category.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/team">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    Meet Our Team
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    Careers
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/advertise">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    Advertise
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    FAQ
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/accessibility">
                  <a className="text-neutral-200 hover:text-white transition-colors">
                    Accessibility
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-400 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-neutral-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} REAL WORLD News. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <Link href="/terms">
              <a className="text-neutral-300 text-sm hover:text-white transition-colors">
                Terms
              </a>
            </Link>
            <Link href="/privacy">
              <a className="text-neutral-300 text-sm hover:text-white transition-colors">
                Privacy
              </a>
            </Link>
            <Link href="/cookies">
              <a className="text-neutral-300 text-sm hover:text-white transition-colors">
                Cookies
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
