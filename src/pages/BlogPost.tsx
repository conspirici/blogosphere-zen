
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import TableOfContents from '@/components/blog/TableOfContents';
import NewsletterForm from '@/components/blog/NewsletterForm';
import BlogCard from '@/components/blog/BlogCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Calendar, Tag } from 'lucide-react';
import { getPostBySlug, getRelatedPosts } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { useFetchWithParams } from '@/hooks/useFetch';
import { Skeleton } from '@/components/ui/skeleton';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Get post data using custom hook
  const { 
    data: post, 
    loading: loadingPost, 
    error: postError 
  } = useFetchWithParams(getPostBySlug, slug || '');
  
  // Get related posts
  const { 
    data: relatedPosts, 
    loading: loadingRelated 
  } = useFetchWithParams(getRelatedPosts, slug || '');
  
  // Handle 404
  useEffect(() => {
    if (!loadingPost && !post && slug) {
      navigate('/not-found', { replace: true });
    }
  }, [post, loadingPost, slug, navigate]);
  
  // Display loading state while fetching data
  if (loadingPost) {
    return (
      <Layout>
        <section className="pt-8 md:pt-12">
          <div className="container-blog max-w-4xl">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => navigate(-1)} className="group flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
              </Button>
            </div>
            
            <div className="space-y-4 animate-pulse">
              <div className="flex gap-2 mb-4">
                {[1, 2].map(i => (
                  <Skeleton key={i} className="h-6 w-24 rounded-full" />
                ))}
              </div>
              <Skeleton className="h-12 w-3/4" />
              <div className="flex gap-4 items-center mb-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="w-full h-72 rounded-lg" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }
  
  if (!post) {
    return null;
  }
  
  // Share functionality
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch((err) => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href).then(
        () => {
          toast({
            title: "Link copied!",
            description: "The post URL has been copied to your clipboard.",
            duration: 3000,
          });
        },
        () => {
          toast({
            title: "Sharing failed",
            description: "Unable to copy the link. Please try again.",
            variant: "destructive",
            duration: 3000,
          });
        }
      );
    }
  };
  
  // Format date for SEO
  const formattedDate = new Date(post.date).toISOString().split('T')[0];

  return (
    <Layout>
      {/* Post Header */}
      <section className="pt-8 md:pt-12">
        <div className="container-blog max-w-4xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="group flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Button>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4 animate-fade-in">
            {post.categories.map((category) => (
              <Link key={category} to={`/categories/${category.toLowerCase()}`} className="category-chip">
                {category}
              </Link>
            ))}
          </div>
          
          {/* Title */}
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 animate-fade-in">
            {post.title}
          </h1>
          
          {/* Meta */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  <time dateTime={formattedDate}>{post.date}</time>
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          
          {/* Featured Image */}
          <div className="rounded-lg overflow-hidden mb-8 animate-fade-in">
            <img 
              src={post.image} 
              alt={post.title}
              className={`w-full h-auto aspect-video object-cover ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
              <div className="w-full h-auto aspect-video bg-muted animate-pulse"></div>
            )}
          </div>
        </div>
      </section>
      
      {/* Post Content */}
      <section className="py-8">
        <div className="container-blog max-w-4xl">
          <div className="grid md:grid-cols-[1fr_300px] gap-8 lg:gap-12">
            {/* Main Content */}
            <article 
              id="article-content"
              className="prose prose-lg dark:prose-invert max-w-none animate-fade-in"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="md:sticky md:top-24">
                <TableOfContents articleId="article-content" />
                
                <div className="mt-6">
                  <h3 className="font-serif text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <NewsletterForm />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      
      {/* Related Posts */}
      {loadingRelated ? (
        <section className="py-16 bg-secondary/30">
          <div className="container-blog">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-8 text-center">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <Skeleton className="h-48 w-full rounded-lg mb-4" />
                  <Skeleton className="h-4 w-1/4 mb-2" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : relatedPosts && relatedPosts.length > 0 ? (
        <section className="py-16 bg-secondary/30">
          <div className="container-blog">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-8 text-center">Related Posts</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((post, index) => (
                <div key={post.id} style={{ animationDelay: `${index * 100}ms` }}>
                  <BlogCard blog={post} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </Layout>
  );
};

export default BlogPost;
