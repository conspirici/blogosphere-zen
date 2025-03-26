
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BlogCard from '@/components/blog/BlogCard';
import SearchBar from '@/components/blog/SearchBar';
import { getAllPosts } from '@/lib/api';
import { useFetch } from '@/hooks/useFetch';
import { Skeleton } from '@/components/ui/skeleton';
import { Helmet } from 'react-helmet-async';

const SearchPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // Get all posts with caching enabled
  const { data: allPosts, loading: loadingPosts } = useFetch(getAllPosts, {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    
    if (q) {
      setSearchQuery(q);
      if (allPosts) {
        handleSearch(q);
      }
    }
  }, [location.search, allPosts]);

  // Search function
  const handleSearch = (query: string) => {
    if (!allPosts) return;
    
    setIsSearching(true);
    setSearchQuery(query);
    
    // Update URL with search query
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url);
    
    // Implement search with delay for better UX
    setTimeout(() => {
      if (query.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      
      const lowercaseQuery = query.toLowerCase();
      
      // Simple search
      const filteredPosts = allPosts.filter(post => 
        post.title.toLowerCase().includes(lowercaseQuery) || 
        post.excerpt.toLowerCase().includes(lowercaseQuery) ||
        post.content.toLowerCase().includes(lowercaseQuery) ||
        post.categories.some((cat: string) => cat.toLowerCase().includes(lowercaseQuery)) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
      );
      
      setSearchResults(filteredPosts);
      setIsSearching(false);
    }, 300);
  };

  return (
    <Layout>
      <Helmet>
        <title>Search | Soul Brew Blog</title>
        <meta name="description" content="Search for articles, tutorials, and more on Soul Brew Blog - your technology blog for web development, hosting, and digital solutions." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <section className="py-16">
        <div className="container-blog max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Search
            </h1>
            <p className="text-muted-foreground mb-8">
              Find articles, categories, and topics of interest
            </p>
            
            <SearchBar 
              onSearch={handleSearch} 
              placeholder="Type keywords and press Enter to search..."
              initialQuery={searchQuery}
            />
          </div>
          
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-6 animate-fade-in">
              <h2 className="font-serif text-xl font-semibold mb-2">
                {isSearching || loadingPosts ? 'Searching...' : (
                  `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} for "${searchQuery}"`
                )}
              </h2>
              <div className="h-1 w-16 bg-primary rounded-full mb-6"></div>
            </div>
          )}
          
          {/* Loading State */}
          {(isSearching || loadingPosts) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <Skeleton className="h-48 w-full rounded-lg mb-4" />
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          )}
          
          {/* Results */}
          {!isSearching && !loadingPosts && searchQuery && (
            <>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.map((post, index) => (
                    <div key={post.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-fade-in">
                      <BlogCard blog={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 animate-fade-in">
                  <p className="text-xl font-serif mb-4">No results found</p>
                  <p className="text-muted-foreground">
                    We couldn't find any content matching "{searchQuery}". 
                    Please try different keywords or browse our categories.
                  </p>
                </div>
              )}
            </>
          )}
          
          {/* Empty State */}
          {!searchQuery && !isSearching && !loadingPosts && (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-muted-foreground">
                Enter keywords above to search for articles, categories, or topics.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SearchPage;
