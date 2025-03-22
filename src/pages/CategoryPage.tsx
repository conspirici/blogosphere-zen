
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import BlogCard from '@/components/blog/BlogCard';
import { getPostsByCategory, getAllCategories } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const allCategories = getAllCategories();
  const isValidCategory = category && allCategories.some(
    cat => cat.toLowerCase() === category.toLowerCase()
  );
  
  const displayCategory = isValidCategory
    ? allCategories.find(cat => cat.toLowerCase() === category?.toLowerCase())
    : '';
    
  const posts = category ? getPostsByCategory(category) : [];

  if (!isValidCategory) {
    return (
      <Layout>
        <div className="container-blog py-24 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/categories')}>
            View All Categories
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="container-blog">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate('/categories')} className="group flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              All Categories
            </Button>
          </div>
          
          <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-in">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
              Category
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              {displayCategory}
            </h1>
            <p className="text-muted-foreground">
              Explore our collection of articles about {displayCategory?.toLowerCase()}
            </p>
          </div>
          
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <div key={post.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <BlogCard blog={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-serif mb-4">No posts found</p>
              <p className="text-muted-foreground mb-6">
                There are no posts available in this category yet.
              </p>
              <Button onClick={() => navigate('/blogs')}>
                View All Posts
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoryPage;
