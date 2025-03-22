
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getAllCategories, getPostsByCategory } from '@/lib/api';

const CategoriesPage = () => {
  const categories = getAllCategories();

  return (
    <Layout>
      <section className="py-16">
        <div className="container-blog">
          <div className="max-w-2xl mx-auto text-center mb-12 animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Categories
            </h1>
            <p className="text-muted-foreground">
              Browse our content by topic to find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const postsCount = getPostsByCategory(category).length;
              
              return (
                <Link 
                  key={category}
                  to={`/categories/${category.toLowerCase()}`} 
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-card rounded-lg border p-6 h-full hover:shadow-md transition-all animate-fade-in">
                    <h2 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {postsCount} {postsCount === 1 ? 'post' : 'posts'}
                    </p>
                    <div className="text-primary font-medium">
                      Browse category
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CategoriesPage;
