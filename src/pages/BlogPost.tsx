
// Import necessary components and utilities
import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, Share } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { getPostBySlug, getRelatedPosts } from '@/lib/api';
import TableOfContents from '@/components/blog/TableOfContents';
import { useFetch } from '@/hooks/useFetch';
import BlogCard from '@/components/blog/BlogCard';
import parse from 'html-react-parser';
import { toast } from 'sonner';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Fetch blog post data
  const { data: post, loading: loadingPost, error: postError } = useFetch(() => getPostBySlug(slug || ''));
  
  // Fetch related posts
  const { data: relatedPosts, loading: loadingRelated } = useFetch(() => 
    post ? getRelatedPosts(post.slug) : Promise.resolve([])
  , { enabled: !!post });
  
  // Format post content for Table of Contents
  const postContent = useMemo(() => {
    return post?.content || '';
  }, [post]);
  
  // Calculate estimated reading time
  const readingTime = useMemo(() => {
    if (!post?.content) return '0 min read';
    
    // Strip HTML tags and count words
    const text = post.content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200); // Average reading speed: 200 words per minute
    
    return `${time} min read`;
  }, [post?.content]);
  
  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else if (post) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };
  
  // Show error state
  if (postError) {
    return (
      <Layout>
        <div className="container-blog py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <p className="mb-6">Sorry, the post you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/blogs')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* SEO - Dynamic Meta Tags */}
      {post && (
        <Helmet>
          <title>{post.title} | Soul Brew Blog</title>
          <meta name="description" content={post.excerpt} />
          <meta property="og:title" content={`${post.title} | Soul Brew Blog`} />
          <meta property="og:description" content={post.excerpt} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://soulbrewblog.com/blog/${post.slug}`} />
          {post.image && <meta property="og:image" content={post.image} />}
          <meta property="article:published_time" content={new Date(post.date).toISOString()} />
          <meta property="article:section" content={post.categories[0] || 'Blog'} />
          {post.tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
          <link rel="canonical" href={`https://soulbrewblog.com/blog/${post.slug}`} />
          
          {/* JSON-LD for Blog Post */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "image": post.image || "",
              "author": {
                "@type": "Person",
                "name": post.author.name
              },
              "publisher": {
                "@type": "Organization",
                "name": "Soul Brew Blog",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://soulbrewblog.com/logo.png"
                }
              },
              "datePublished": new Date(post.date).toISOString(),
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://soulbrewblog.com/blog/${post.slug}`
              }
            })}
          </script>
        </Helmet>
      )}
      
      <article className="py-8 md:py-12">
        <div className="container-blog">
          {/* Breadcrumb & Back Button */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="hover:bg-transparent p-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
          
          {loadingPost ? (
            /* Loading UI */
            <div className="animate-pulse space-y-8">
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="flex space-x-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
              <Skeleton className="h-[400px] w-full rounded-xl" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
          ) : post ? (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
              {/* Title & Meta */}
              <header className="text-center space-y-6">
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {post.categories.map((category) => (
                    <Link 
                      key={category} 
                      to={`/categories/${category.toLowerCase()}`} 
                      className="category-chip"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
                
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <Link to={`/author/${post.author.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-foreground">
                      {post.author.name}
                    </Link>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <time dateTime={new Date(post.date).toISOString()}>
                      {post.date}
                    </time>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{readingTime}</span>
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={handleShare} className="p-0 h-auto">
                    <Share className="h-4 w-4 mr-1" />
                    <span>Share</span>
                  </Button>
                </div>
              </header>
              
              {/* Featured Image */}
              {post.image && (
                <div className="relative rounded-xl overflow-hidden aspect-video">
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                      <span className="text-sm text-muted-foreground">Loading image...</span>
                    </div>
                  )}
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                    width="1200"
                    height="630"
                    fetchPriority="high"
                  />
                </div>
              )}
              
              {/* Table of Contents & Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <aside className="lg:col-span-3 hidden md:block">
                  <div className="sticky top-24">
                    <TableOfContents content={postContent} />
                  </div>
                </aside>
                
                <div className="lg:col-span-9">
                  <div className="blog-content prose prose-lg dark:prose-invert max-w-none">
                    {parse(post.content)}
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-lg font-medium mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link 
                        key={tag} 
                        to={`/search?q=${encodeURIComponent(tag)}`}
                        className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full hover:bg-secondary/80 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          
          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t animate-fade-in">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Related Posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="transform transition-transform hover:-translate-y-1">
                      <BlogCard blog={relatedPost} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
