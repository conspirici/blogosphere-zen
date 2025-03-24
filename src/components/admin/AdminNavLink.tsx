
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

// The email address that is allowed to access the admin dashboard
const ALLOWED_ADMIN_EMAIL = 'sydmnsur@gmail.com';

const AdminNavLink = () => {
  const { user } = useAuth();
  
  // Only show admin link to authorized users
  if (!user || user.email !== ALLOWED_ADMIN_EMAIL) {
    return null;
  }
  
  return (
    <Link 
      to="/admin" 
      className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
      title="Admin Dashboard"
    >
      <FileText className="h-4 w-4" />
      <span className="md:inline hidden">Admin</span>
    </Link>
  );
};

export default AdminNavLink;
