
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="container-blog py-16 md:py-24">
        <div className="max-w-md mx-auto text-center">
          <h1 className="font-serif text-8xl font-bold text-primary mb-4 animate-fade-in">404</h1>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link to="/">
              <Button className="w-full sm:w-auto flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
            
            <Link to="/search">
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search the Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
