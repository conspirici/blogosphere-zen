
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>About Us | Soul Brew Blog</title>
        <meta name="description" content="Learn about Soul Brew Blog - a tech blog focused on web development, emerging technologies, and informed decision-making." />
        <meta property="og:title" content="About Us | Soul Brew Blog" />
        <meta property="og:description" content="Learn about Soul Brew Blog - a tech blog focused on web development, emerging technologies, and informed decision-making." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://soulbrewblog.com/about" />
        <meta property="og:image" content="https://soulbrewblog.com/og-image.jpg" />
        <link rel="canonical" href="https://soulbrewblog.com/about" />
      </Helmet>
      
      <section className="py-16">
        <div className="container-blog max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="font-montserrat text-3xl md:text-4xl font-bold mb-4">
              Soul Brew Blog
            </h1>
            <p className="text-muted-foreground">
              Our story, mission, and the people behind the blog
            </p>
          </div>
          
          <div className="prose prose-lg dark:prose-invert max-w-none animate-fade-in">
            <p className="lead">
              Soul Brew Blog is a minimalist blog focused on exploring the intersection of web development, 
              emerging technologies, and informed decision-making. We believe in quality over quantity, 
              both in content and in life.
            </p>
            
            <h2>Our Mission</h2>
            <p>
              We aim to empower developers, tech enthusiasts, and businesses by providing insightful 
              content about web development. Our goal is to help our readers make informed choices 
              about the best technologies, frameworks, and strategies for their projects.
            </p>
            
            <h2>Our Content Philosophy</h2>
            <p>
              Every article on Soul Brew Blog is crafted with intention and depth. We prioritize well-researched, 
              practical, and insightful content over superficial trends. Our focus is on delivering value 
              through actionable advice, industry trends, and development best practices.
            </p>
            
            <h2>Our Founder</h2>
            <div className="text-center my-8">
              <img 
                src="https://i.pinimg.com/736x/21/51/b1/2151b1243010cb61efa3fd74516ceb0c.jpg" 
                alt="Shah Mansoor" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                loading="lazy"
              />
              <h3 className="font-serif text-xl font-medium mb-1">Shah Mansoor</h3>
              <p className="text-primary mb-2">Founder & Editor</p>
              <p className="text-sm text-muted-foreground">
                A software engineer and tech enthusiast specializing in web development. Started Soul Brew Blog 
                as a hobby and a way to help readers make informed decisions about modern web development.
              </p>
            </div>
            
            <h2>Our Web Development Agency</h2>
            <p>
              For those looking for premium-quality, custom-built websites, 
              we run our own web development agency—
              <a href="https://devylin.tech" className="text-primary hover:underline">Devylin.tech</a>. 
              We specialize in building high-performance, scalable, and beautifully designed websites 
              tailored to your business needs.
            </p>
            
            <h2>Our Values</h2>
            <ul>
              <li>
                <strong>Innovation:</strong> Staying ahead in the ever-evolving field of web development.
              </li>
              <li>
                <strong>Quality:</strong> Prioritizing well-crafted, scalable, and maintainable code.
              </li>
              <li>
                <strong>Community:</strong> Sharing knowledge and helping developers grow.
              </li>
              <li>
                <strong>Integrity:</strong> Providing honest, research-backed insights without hype.
              </li>
              <li>
                <strong>Growth:</strong> Embracing continuous learning and improvement.
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
              journey of web development and innovation together.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
