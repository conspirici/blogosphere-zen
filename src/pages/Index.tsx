
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogCard from '@/components/blog/BlogCard';
import CategoryFilter from '@/components/blog/CategoryFilter';
import NewsletterForm from '@/components/blog/NewsletterForm';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { getAllPosts, getFeaturedPost, getAllCategories } from '@/lib/api';

const Index = () => {
  const featuredPost = getFeaturedPost();
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 6);
  const categories = getAllCategories();
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredPosts = selectedCategory 
    ? latestPosts.filter(post => 
        post.categories.includes(selectedCategory)
      )
    : latestPosts;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container-blog">
          <div className="max-w-2xl mx-auto text-center mb-12 md:mb-16 animate-fade-in">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Blogosphere
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              A minimalist blog exploring lifestyle, design, and sustainability
            </p>
          </div>
          
          {/* Featured Post */}
          <div className="animate-fade-in">
            <FeaturedPost post={featuredPost} />
          </div>
        </div>
      </section>
      
      {/* Latest Posts */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container-blog">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Latest Posts</h2>
            <Link to="/blogs">
              <Button variant="ghost" className="group">
                View All
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          {/* Category Filter */}
          <div className="mb-8">
            <CategoryFilter 
              categories={categories} 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <div key={post.id} style={{ animationDelay: `${index * 100}ms` }}>
                <BlogCard blog={post} />
              </div>
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts found in this category.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSelectedCategory('')}
              >
                View All Categories
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 md:py-24">
        <div className="container-blog max-w-4xl">
          <NewsletterForm />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
