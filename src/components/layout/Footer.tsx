
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container-blog">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold">Blogosphere</h3>
            <p className="text-muted-foreground">
              A minimalist blog focusing on lifestyle, design, and sustainability.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold">Navigation</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link to="/blogs" className="text-muted-foreground hover:text-foreground transition-colors">Blogs</Link></li>
              <li><Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">Categories</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/categories/minimalism" className="text-muted-foreground hover:text-foreground transition-colors">Minimalism</Link></li>
              <li><Link to="/categories/sustainability" className="text-muted-foreground hover:text-foreground transition-colors">Sustainability</Link></li>
              <li><Link to="/categories/lifestyle" className="text-muted-foreground hover:text-foreground transition-colors">Lifestyle</Link></li>
              <li><Link to="/categories/design" className="text-muted-foreground hover:text-foreground transition-colors">Design</Link></li>
              <li><Link to="/categories/travel" className="text-muted-foreground hover:text-foreground transition-colors">Travel</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold">Subscribe</h3>
            <p className="text-muted-foreground">Get the latest posts delivered straight to your inbox.</p>
            <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); console.log("Subscription submitted"); }}>
              <div>
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Blogosphere. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
