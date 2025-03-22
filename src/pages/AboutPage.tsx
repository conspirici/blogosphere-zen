
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';

const AboutPage = () => {
  return (
    <Layout>
      <section className="py-16">
        <div className="container-blog max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              About Blogosphere
            </h1>
            <p className="text-muted-foreground">
              Our story, mission, and the people behind the blog
            </p>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none animate-fade-in">
            <p className="lead">
              Blogosphere is a minimalist blog focused on exploring the intersection of mindful living, 
              sustainable practices, and intentional design. We believe in quality over quantity, 
              both in content and in life.
            </p>
            
            <h2>Our Mission</h2>
            <p>
              We aim to inspire and equip our readers to live more intentionally, 
              making thoughtful choices that benefit both personal wellbeing and planetary health. 
              Through carefully crafted content, we explore minimalism not as a rigid aesthetic 
              but as a flexible philosophy that can enhance everyone's life.
            </p>
            
            <h2>Our Content Philosophy</h2>
            <p>
              Every article published on Blogosphere is created with intention and care. 
              We prioritize depth over breadth, taking the time to thoroughly research topics 
              and present them in a clear, accessible manner. Our content is designed to be 
              both practical and inspiring, offering concrete steps alongside broader ideas.
            </p>
            
            <h2>Our Team</h2>
            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1557555187-23d685287bc3?w=400&h=400&fit=crop" 
                  alt="Jordan Chen" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-serif text-xl font-medium mb-1">Jordan Chen</h3>
                <p className="text-primary mb-2">Founder & Editor</p>
                <p className="text-sm text-muted-foreground">
                  Environmental scientist with a passion for communicating sustainability 
                  in accessible ways.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&h=400&fit=crop" 
                  alt="Alex Morgan" 
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-serif text-xl font-medium mb-1">Alex Morgan</h3>
                <p className="text-primary mb-2">Content Director</p>
                <p className="text-sm text-muted-foreground">
                  Designer and writer focused on minimalism as a path to more meaningful living 
                  in a complex world.
                </p>
              </div>
            </div>
            
            <h2>Our Values</h2>
            <ul>
              <li>
                <strong>Intentionality:</strong> Making conscious choices that align with our values 
                and priorities.
              </li>
              <li>
                <strong>Sustainability:</strong> Considering the long-term environmental and social 
                impact of our choices.
              </li>
              <li>
                <strong>Quality:</strong> Favoring durability, craftsmanship, and timelessness over 
                trends and disposability.
              </li>
              <li>
                <strong>Balance:</strong> Finding the middle path between extremes and adapting 
                principles to individual circumstances.
              </li>
              <li>
                <strong>Growth:</strong> Embracing continuous learning and evolution in our 
                understanding and practices.
              </li>
            </ul>
            
            <Separator className="my-8" />
            
            <h2>Connect With Us</h2>
            <p>
              We love hearing from our readers! Whether you have a question, suggestion, 
              or just want to say hello, feel free to reach out through our 
              <a href="/contact" className="text-primary hover:underline"> contact page</a> or 
              connect with us on social media.
            </p>
            
            <p>
              Thank you for being part of our community. We're excited to continue this 
              journey of exploration and intention together.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
