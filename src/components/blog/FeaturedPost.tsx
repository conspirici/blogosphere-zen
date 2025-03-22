
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';

interface FeaturedPostProps {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    categories: string[];
  };
}

const FeaturedPost = ({ post }: FeaturedPostProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="blog-img-wrapper h-full">
        <img 
          src={post.image} 
          alt={post.title}
          className={`blog-img ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse"></div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <time dateTime={post.date}>{post.date}</time>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {post.categories.map((category) => (
            <Link key={category} to={`/categories/${category.toLowerCase()}`} className="category-chip">
              {category}
            </Link>
          ))}
        </div>
        
        <Link to={`/blog/${post.slug}`}>
          <h2 className="font-serif text-3xl font-bold hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-muted-foreground">{post.excerpt}</p>
        
        <Link 
          to={`/blog/${post.slug}`}
          className="inline-block text-primary font-medium hover:underline"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default FeaturedPost;
