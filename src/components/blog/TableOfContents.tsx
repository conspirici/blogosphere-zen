
import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  articleId: string;
}

const TableOfContents = ({ articleId }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const article = document.getElementById(articleId);
    if (!article) return;

    const elements = Array.from(article.querySelectorAll('h2, h3, h4'));
    const items: TOCItem[] = elements.map((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, '-') || '';
      if (!heading.id) {
        heading.id = id;
      }
      
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      };
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    elements.forEach((heading) => observer.observe(heading));

    return () => {
      elements.forEach((heading) => observer.unobserve(heading));
    };
  }, [articleId]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-secondary/50 rounded-lg p-4">
      <h3 className="font-serif text-lg font-semibold mb-4">Table of Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li 
            key={heading.id}
            className={`text-sm ${
              heading.level === 2 ? 'ml-0' : heading.level === 3 ? 'ml-4' : 'ml-6'
            }`}
          >
            <Link
              to={heading.id}
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
              className={`block cursor-pointer hover:text-primary transition-colors py-1 ${
                activeId === heading.id ? 'text-primary font-medium' : 'text-foreground/80'
              }`}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;
