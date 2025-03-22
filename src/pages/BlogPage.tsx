
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BlogCard from '@/components/blog/BlogCard';
import CategoryFilter from '@/components/blog/CategoryFilter';
import Pagination from '@/components/blog/Pagination';
import SearchBar from '@/components/blog/SearchBar';
import NewsletterForm from '@/components/blog/NewsletterForm';
import { getAllPosts, getAllCategories } from '@/lib/api';

const BlogPage = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  
  // Number of posts per page
  const postsPerPage = 9;
  
  // Get all posts and categories
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  
  // Filter posts based on search query and category
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = searchQuery 
      ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
      
    const matchesCategory = selectedCategory
      ? post.categories.includes(selectedCategory)
      : true;
      
    return matchesSearch && matchesCategory;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <section className="bg-background py-16">
        <div className="container-blog">
          <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              {selectedCategory ? selectedCategory : 'All Blog Posts'}
            </h1>
            <p className="text-muted-foreground">
              {selectedCategory 
                ? `Exploring our collection of articles about ${selectedCategory.toLowerCase()}`
                : 'Discover our latest thoughts, ideas, and insights'
              }
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="grid md:grid-cols-[1fr_300px] gap-6 mb-8">
            <SearchBar onSearch={handleSearch} />
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </div>
          
          {/* Results Info */}
          {searchQuery && (
            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'} found for "{searchQuery}"
              </p>
            </div>
          )}
          
          {/* Posts Grid */}
          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedPosts.map((post, index) => (
                <div key={post.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <BlogCard blog={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 mb-8">
              <p className="text-xl font-serif mb-4">No posts found</p>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? `No results match your search for "${searchQuery}"`
                  : 'No posts available in this category yet'
                }
              </p>
              <div className="space-x-4">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
                {selectedCategory && (
                  <button 
                    onClick={() => setSelectedCategory('')}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
                  >
                    View All Categories
                  </button>
                )}
              </div>
            </div>
          )}
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-16 bg-secondary/30">
        <div className="container-blog max-w-4xl">
          <NewsletterForm />
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
