
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { signOutUser } from '@/lib/firebase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOutUser();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Navbar */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-serif text-xl font-bold">
              Blog<span className="text-primary">Admin</span>
            </Link>
            
            <nav className="hidden md:flex gap-6">
              <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </Link>
              <Link to="/admin/blog/new" className="text-sm font-medium transition-colors hover:text-primary">
                New Post
              </Link>
              <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                View Blog
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {user.displayName || user.email}
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>Sign Out</Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Admin Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Blog Admin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
