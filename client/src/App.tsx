import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ArticleDetail from "@/pages/ArticleDetail";
import CategoryNews from "@/pages/CategoryNews";
import { useState } from "react";
import SearchOverlay from "./components/layout/SearchOverlay";
import MobileMenu from "./components/layout/MobileMenu";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:id" component={ArticleDetail} />
      <Route path="/category/:category" component={CategoryNews} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header 
            onOpenSearch={() => setSearchOpen(true)} 
            onOpenMobileMenu={() => setMobileMenuOpen(true)} 
          />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
