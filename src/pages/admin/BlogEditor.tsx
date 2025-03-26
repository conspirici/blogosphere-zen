
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostBySlug, savePost, getAllCategories, saveCategory } from '@/lib/api';
import { Post } from '@/lib/api';
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
import { ArrowLeft, Save, Eye, Loader2, Plus, Upload, FileText, File } from 'lucide-react';
import slugify from 'slugify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'sonner';
import { getCurrentUser } from '@/lib/firebase';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [post, setPost] = useState<Post>(initialPostState);
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(!!slug);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!slug);
  const [previewMode, setPreviewMode] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getAllCategories();
        setAllCategories(categories);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Failed to load categories");
      }
    };
    
    loadCategories();
  }, []);

  // Fetch existing post data if in edit mode
  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        setIsLoading(true);
        try {
          const existingPost = await getPostBySlug(slug);
          if (existingPost) {
            setPost(existingPost);
            setHtmlContent(existingPost.content);
            setTagsInput(existingPost.tags.join(', '));
          } else {
            toast.error(`Could not find a post with slug: ${slug}`);
            navigate('/admin');
          }
        } catch (error) {
          console.error("Error loading post:", error);
          toast.error("Failed to load post");
          navigate('/admin');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadPost();
  }, [slug, navigate]);

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

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    
    setAddingCategory(true);
    try {
      await saveCategory(newCategory.trim());
      setAllCategories(prev => [...prev, newCategory.trim()].sort());
      handleCategoryChange(newCategory.trim());
      setNewCategory('');
      toast.success(`Added category: ${newCategory.trim()}`);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    } finally {
      setAddingCategory(false);
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

  // Handle featured image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    setUploadingImage(true);
    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `blog-images/${timestamp}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setPost(prev => ({ ...prev, image: downloadURL }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const allowedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/html', 'text/plain'];
    
    if (!allowedFileTypes.includes(file.type)) {
      toast.error('Please select a supported document (PDF, DOC, DOCX, HTML, TXT)');
      return;
    }
    
    setUploadingDocument(true);
    try {
      // For text-based files, we can extract content
      if (file.type === 'text/html' || file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          
          // For HTML, we can directly use the content
          if (file.type === 'text/html') {
            setHtmlContent(prev => prev + content);
            setPost(prev => ({ ...prev, content: prev.content + content }));
            toast.success('HTML content added to editor');
          } 
          // For plain text, convert to HTML paragraphs
          else {
            const htmlContent = content
              .split('\n')
              .filter(line => line.trim() !== '')
              .map(line => `<p>${line}</p>`)
              .join('');
            
            setHtmlContent(prev => prev + htmlContent);
            setPost(prev => ({ ...prev, content: prev.content + htmlContent }));
            toast.success('Text content added to editor');
          }
        };
        reader.readAsText(file);
      } 
      // For other document types, we'll upload them and provide a link
      else {
        const timestamp = Date.now();
        const storageRef = ref(storage, `blog-documents/${timestamp}_${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Create a download link for the document
        const linkHtml = `<p><a href="${downloadURL}" target="_blank" rel="noopener noreferrer">Download ${file.name}</a></p>`;
        setHtmlContent(prev => prev + linkHtml);
        setPost(prev => ({ ...prev, content: prev.content + linkHtml }));
        toast.success('Document link added to editor');
      }
    } catch (error) {
      console.error('Error processing document:', error);
      toast.error('Failed to process document');
    } finally {
      setUploadingDocument(false);
    }
  };

  // Save blog post
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Validate required fields
      if (!post.title || !post.content || !post.excerpt) {
        toast.error("Please fill in all required fields (title, excerpt, content)");
        setIsSaving(false);
        return;
      }
      
      // Generate slug if not already set
      if (!post.slug) {
        generateSlug();
      }
      
      // Set author information from current user
      const user = getCurrentUser();
      if (user) {
        post.author = {
          name: user.displayName || user.email?.split('@')[0] || 'Anonymous',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop'
        };
      }
      
      // Save to Firestore
      await savePost(post, !isEditMode);
      
      toast.success(`Your post "${post.title}" has been ${isEditMode ? 'updated' : 'created'} successfully`);
      
      // Navigate back to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container py-8 flex items-center justify-center" style={{ minHeight: "60vh" }}>
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading post...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
                <Loader2 className="h-4 w-4 animate-spin" />
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
                  <Label htmlFor="image">Featured Image</Label>
                  <div className="grid gap-2">
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        name="image"
                        value={post.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button 
                        type="button" 
                        variant="secondary"
                        disabled={uploadingImage}
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="whitespace-nowrap"
                      >
                        {uploadingImage ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        Upload
                      </Button>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    {post.image && (
                      <div className="relative h-40 w-full rounded-md overflow-hidden">
                        <img 
                          src={post.image} 
                          alt="Featured" 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    )}
                  </div>
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div className="md:col-span-4">
                      <Select onValueChange={handleCategoryChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
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
                    <div className="flex gap-2 items-center md:col-span-4 mt-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add new category"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                      />
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={handleAddCategory}
                        disabled={addingCategory || !newCategory.trim()}
                        className="whitespace-nowrap"
                      >
                        {addingCategory ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={tagsInput}
                    onChange={handleTagsChange}
                    placeholder="web-development, hosting, seo"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Document Upload */}
            <div className="space-y-2">
              <Label>Upload Document</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  disabled={uploadingDocument}
                  onClick={() => document.getElementById('document-upload')?.click()}
                  className="w-full flex items-center justify-center"
                >
                  {uploadingDocument ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  {uploadingDocument ? 'Uploading...' : 'Upload Document (HTML, PDF, DOC, TXT)'}
                </Button>
                <input
                  id="document-upload"
                  type="file"
                  accept=".html,.pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleDocumentUpload}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload HTML or TXT files to import content directly into the editor. PDF and DOC files will be added as download links.
              </p>
            </div>
            
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
