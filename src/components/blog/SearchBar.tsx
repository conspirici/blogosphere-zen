
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import lunr from 'lunr';
import { getAllPosts } from '@/lib/api';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialQuery?: string;
  useIndex?: boolean;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search articles...",
  initialQuery = '',
  useIndex = false
}: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);

  // Initialize lunr search index if useIndex is true
  useEffect(() => {
    if (useIndex) {
      const posts = getAllPosts();
      const idx = lunr(function() {
        this.field('title', { boost: 10 });
        this.field('excerpt', { boost: 5 });
        this.field('content');
        this.field('categories', { boost: 5 });
        this.field('tags', { boost: 5 });
        this.ref('slug');
        
        posts.forEach(post => {
          this.add({
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            categories: post.categories.join(' '),
            tags: post.tags.join(' ')
          });
        });
      });
      
      setSearchIndex(idx);
    }
  }, [useIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Optionally implement real-time search after a slight delay
    if (value.length >= 2) {
      const debounceSearch = setTimeout(() => {
        performSearch();
      }, 300);
      
      return () => clearTimeout(debounceSearch);
    }
  };

  const performSearch = () => {
    if (useIndex && searchIndex && query.trim()) {
      try {
        const results = searchIndex.search(query);
        onSearch(query);
      } catch (error) {
        // Fallback to regular search if lunr syntax error occurs
        console.log('Lunr search error, falling back to regular search');
        onSearch(query);
      }
    } else {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="pl-10 pr-4 py-2"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    </form>
  );
};

export default SearchBar;
