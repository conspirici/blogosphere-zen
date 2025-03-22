
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';

interface BlogCardProps {
  blog: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    categories: string[];
  };
}

const BlogCard = ({ blog }: BlogCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <Card className="post-card group animate-fade-in">
      <Link to={`/blog/${blog.slug}`} className="block">
        <div className="blog-img-wrapper mb-4">
          <img 
            src={blog.image} 
            alt={blog.title}
            className={`blog-img ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse"></div>
          )}
        </div>
      </Link>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <time dateTime={blog.date}>{blog.date}</time>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {blog.categories.map((category) => (
            <Link key={category} to={`/categories/${category.toLowerCase()}`} className="category-chip">
              {category}
            </Link>
          ))}
        </div>
        
        <Link to={`/blog/${blog.slug}`} className="block">
          <h3 className="font-serif text-xl font-semibold group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          
          <p className="text-muted-foreground mt-2 line-clamp-2">
            {blog.excerpt}
          </p>
        </Link>
      </div>
    </Card>
  );
};

export default BlogCard;
