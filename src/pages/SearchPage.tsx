
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BlogCard from '@/components/blog/BlogCard';
import SearchBar from '@/components/blog/SearchBar';
import { searchPosts } from '@/lib/api';

const SearchPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchPosts>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Extract search query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    
    if (q) {
      setSearchQuery(q);
      handleSearch(q);
    }
  }, [location.search]);

  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearchQuery(query);
    
    // Update URL with search query
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const results = searchPosts(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  return (
    <Layout>
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
            />
          </div>
          
          {/* Search Results */}
          {searchQuery && (
            <div className="mb-6 animate-fade-in">
              <h2 className="font-serif text-xl font-semibold mb-2">
                {isSearching ? 'Searching...' : (
                  `${searchResults.length} ${searchResults.length === 1 ? 'result' : 'results'} for "${searchQuery}"`
                )}
              </h2>
              <div className="h-1 w-16 bg-primary rounded-full mb-6"></div>
            </div>
          )}
          
          {/* Loading State */}
          {isSearching && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-48 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          )}
          
          {/* Results */}
          {!isSearching && searchQuery && (
            <>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.map((post, index) => (
                    <div key={post.id} style={{ animationDelay: `${index * 100}ms` }}>
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
          {!searchQuery && !isSearching && (
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
