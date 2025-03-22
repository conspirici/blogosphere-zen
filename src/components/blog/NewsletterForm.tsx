
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Replace 'YOUR_NEWSLETTER_FORMSPREE_ENDPOINT' with your actual Formspree endpoint
      const response = await fetch('https://formspree.io/f/YOUR_NEWSLETTER_FORMSPREE_ENDPOINT', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        toast({
          title: "Subscription successful!",
          description: "Thank you for subscribing to our newsletter.",
          duration: 5000,
        });
        setEmail('');
      } else {
        throw new Error('Newsletter subscription failed');
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an issue subscribing to the newsletter. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-secondary/50 rounded-lg p-6 md:p-8">
      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
        <Mail className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="font-serif text-xl font-semibold mb-2">Subscribe to our newsletter</h3>
      <p className="text-muted-foreground mb-4">
        Get notified when we publish new content. No spam, just quality content.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      
      <p className="text-xs text-muted-foreground mt-4">
        By subscribing, you agree to our privacy policy and terms of service.
      </p>
    </div>
  );
};

export default NewsletterForm;
