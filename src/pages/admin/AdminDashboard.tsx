
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getAllPosts, deletePost } from '@/lib/api';
import { signOutUser } from '@/lib/firebase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash, 
  Eye, 
  MoreVertical, 
  FileText,
  Loader2
} from 'lucide-react';
import SearchBar from '@/components/blog/SearchBar';
import { Post } from '@/lib/api';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  // Load posts from Firestore
  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter((post) => 
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.categories.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredPosts(filtered);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    
    setIsDeleting(true);
    try {
      await deletePost(postToDelete.id);
      toast.success("Post deleted successfully");
      // Refresh the posts list
      loadPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground">
              Manage your blog posts, create new content, and publish updates
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
            <Link to="/admin/blog/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Search blog posts..." />
        </div>

        {/* Posts Table */}
        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Loading posts...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {post.categories.map((category) => (
                          <span 
                            key={category} 
                            className="inline-block px-2 py-1 text-xs bg-secondary rounded-full"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/blog/edit/${post.slug}`} className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/blog/${post.slug}`} target="_blank" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive flex items-center gap-2"
                            onClick={() => setPostToDelete(post)}
                          >
                            <Trash className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No blog posts found</p>
                      {searchQuery && (
                        <Button 
                          variant="ghost" 
                          className="mt-2"
                          onClick={() => handleSearch('')}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post 
              "{postToDelete?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminDashboard;
