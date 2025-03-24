
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getPostBySlug, Post } from '@/lib/api';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import slugify from 'slugify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAllCategories } from '@/lib/api';

// Rich text editor modules configuration
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['link', 'image'],
    ['clean']
  ],
};

// Initial post state
const initialPostState: Post = {
  id: '',
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  date: new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }),
  author: {
    name: '',
    avatar: ''
  },
  image: '',
  categories: [],
  tags: []
};

const BlogEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<Post>(initialPostState);
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(!!slug);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [allCategories] = useState(getAllCategories());

  // Fetch existing post data if in edit mode
  useEffect(() => {
    if (slug) {
      const existingPost = getPostBySlug(slug);
      if (existingPost) {
        setPost(existingPost);
        setHtmlContent(existingPost.content);
        setTagsInput(existingPost.tags.join(', '));
      } else {
        toast({
          title: "Post not found",
          description: `Could not find a post with slug: ${slug}`,
          variant: "destructive",
        });
        navigate('/admin');
      }
    }
  }, [slug, navigate, toast]);

  // Generate slug from title
  const generateSlug = useCallback(() => {
    if (post.title) {
      const generatedSlug = slugify(post.title, { 
        lower: true,
        strict: true,
        trim: true
      });
      setPost(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [post.title]);

  // Update blog post data
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  // Handle rich text editor content change
  const handleContentChange = (content: string) => {
    setHtmlContent(content);
    setPost(prev => ({ ...prev, content }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryName: string) => {
    if (!post.categories.includes(categoryName)) {
      setPost(prev => ({
        ...prev,
        categories: [...prev.categories, categoryName]
      }));
    }
  };

  // Remove category
  const handleRemoveCategory = (categoryName: string) => {
    setPost(prev => ({
      ...prev,
      categories: prev.categories.filter(cat => cat !== categoryName)
    }));
  };

  // Handle tags input
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setPost(prev => ({ ...prev, tags: tagsArray }));
  };

  // Save blog post
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Validate required fields
      if (!post.title || !post.content || !post.excerpt) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields (title, excerpt, content)",
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }
      
      // Generate slug if not already set
      if (!post.slug) {
        generateSlug();
      }
      
      // In a real app, you would save to a database or API here
      // For now, let's just show a success message
      
      toast({
        title: isEditMode ? "Post updated" : "Post created",
        description: `Your post "${post.title}" has been ${isEditMode ? 'updated' : 'created'} successfully`,
      });
      
      // Navigate back to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: "Failed to save post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="font-serif text-2xl font-bold">
              {isEditMode ? 'Edit Post' : 'Create New Post'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving && (
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              )}
              <Save className="h-4 w-4" />
              Save {isEditMode ? 'Changes' : 'Post'}
            </Button>
          </div>
        </div>
        
        {previewMode ? (
          // Preview Mode
          <div className="bg-card border rounded-lg p-8">
            <h2 className="font-serif text-3xl font-bold mb-4">{post.title}</h2>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <span key={category} className="category-chip">
                  {category}
                </span>
              ))}
            </div>
            
            <p className="text-muted-foreground mb-6">{post.excerpt}</p>
            
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            
            <div className="mt-8 pt-4 border-t">
              <h3 className="font-medium mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-block px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Edit Mode
          <div className="grid gap-8">
            {/* Post Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={post.title}
                    onChange={handleInputChange}
                    onBlur={generateSlug}
                    placeholder="Enter post title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      name="slug"
                      value={post.slug}
                      onChange={handleInputChange}
                      placeholder="post-url-slug"
                    />
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={generateSlug}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={post.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief description of the post"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Featured Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={post.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.categories.map((category) => (
                      <div key={category} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full">
                        <span className="text-sm">{category}</span>
                        <button 
                          onClick={() => handleRemoveCategory(category)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories
                        .filter(cat => !post.categories.includes(cat))
                        .map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={tagsInput}
                    onChange={handleTagsChange}
                    placeholder="minimalism, sustainability, eco-friendly"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Content Editor */}
            <div className="space-y-2">
              <Label>Content</Label>
              <Tabs defaultValue="editor">
                <TabsList className="mb-4">
                  <TabsTrigger value="editor">Rich Text Editor</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="border rounded-md">
                  <ReactQuill
                    value={htmlContent}
                    onChange={handleContentChange}
                    modules={quillModules}
                    className="min-h-[400px]"
                  />
                </TabsContent>
                
                <TabsContent value="html">
                  <Textarea
                    value={htmlContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    placeholder="<p>Your HTML content here</p>"
                    className="font-mono text-sm min-h-[400px]"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BlogEditor;
