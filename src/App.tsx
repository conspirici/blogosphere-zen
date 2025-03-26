
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from "react-ga4";

// Pages
import Index from "./pages/Index";
import BlogPage from "./pages/BlogPage";
import BlogPost from "./pages/BlogPost";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import BlogEditor from "./pages/admin/BlogEditor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (replaces cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Google Analytics Tracking Component
const RouteTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  
  return null;
};

const App = () => {
  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize("G-T40GMB8WJV");
    
    // Add Schema.org JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Soul Brew Blog",
      "url": "https://soulbrewblog.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://soulbrewblog.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "description": "A technology blog about web development, hosting, and digital solutions",
      "publisher": {
        "@type": "Organization",
        "name": "Soul Brew Blog",
        "logo": {
          "@type": "ImageObject",
          "url": "https://soulbrewblog.com/logo.png"
        }
      }
    });
    document.head.appendChild(script);

    // Initialize dark mode based on user preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <RouteTracker />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blogs" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:category" element={<CategoryPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/blog/new" element={
                <AdminProtectedRoute>
                  <BlogEditor />
                </AdminProtectedRoute>
              } />
              <Route path="/admin/blog/edit/:slug" element={
                <AdminProtectedRoute>
                  <BlogEditor />
                </AdminProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </HelmetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
