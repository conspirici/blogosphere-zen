
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const ALLOWED_ADMIN_EMAIL = 'sydmnsur@gmail.com';

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast({
          title: "Access denied",
          description: "You need to sign in to access this page",
          variant: "destructive",
        });
        navigate('/admin/login');
      } else if (user.email !== ALLOWED_ADMIN_EMAIL) {
        toast({
          title: "Access denied",
          description: "You don't have admin permissions",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [user, loading, navigate, toast]);

  if (loading) {
    return <div className="container flex items-center justify-center min-h-screen">
      <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  if (!user || user.email !== ALLOWED_ADMIN_EMAIL) {
    return null;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
