
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getAllCategories, getPostsByCategory } from '@/lib/api';
import { useFetch, useFetchWithParams } from '@/hooks/useFetch';
import { Skeleton } from '@/components/ui/skeleton';

const CategoryItem = ({ category }: { category: string }) => {
  const { data: posts, loading } = useFetchWithParams(getPostsByCategory, category);
  const postsCount = posts ? posts.length : 0;
  
  return (
    <Link to={`/categories/${category.toLowerCase()}`} className="group">
      <div className="bg-card rounded-lg border p-6 h-full hover:shadow-md transition-all animate-fade-in">
        <h2 className="font-serif text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {category}
        </h2>
        {loading ? (
          <Skeleton className="h-4 w-20 mb-4" />
        ) : (
          <p className="text-muted-foreground mb-4">
            {postsCount} {postsCount === 1 ? 'post' : 'posts'}
          </p>
        )}
        <div className="text-primary font-medium">
          Browse category
        </div>
      </div>
    </Link>
  );
};

const CategoriesPage = () => {
  const { data: categories, loading } = useFetch(getAllCategories);

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
          
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="animate-pulse">
                  <Skeleton className="h-32 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <div key={category} style={{ animationDelay: `${index * 100}ms` }}>
                  <CategoryItem category={category} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No categories found.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CategoriesPage;
