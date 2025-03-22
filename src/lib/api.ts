
export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: {
    name: string;
    avatar: string;
  };
  image: string;
  categories: string[];
  tags: string[];
}

// Sample blog data
const posts: Post[] = [
  {
    id: "1",
    slug: "living-light-minimalist-lifestyle",
    title: "Living Light: The Minimalist Lifestyle and its Environmental Impact",
    excerpt: "Discover how embracing minimalism can reduce your environmental footprint and lead to a more intentional life.",
    content: `
      <p>In a world dominated by consumerism and material excess, minimalism offers a refreshing alternative that not only simplifies our lives but also benefits the environment. This philosophy extends beyond just decluttering your physical space—it represents a mindful approach to consumption and lifestyle choices.</p>
      
      <h2 id="what-is-minimalism">What is Minimalism?</h2>
      <p>At its core, minimalism is about intentionality. It's the practice of identifying what truly adds value to your life and eliminating everything else. Contrary to popular belief, minimalism isn't about living with nothing—it's about living with just the right things.</p>
      
      <h2 id="environmental-benefits">Environmental Benefits</h2>
      <p>When we consume less, we reduce waste, conserve resources, and decrease our carbon footprint. The environmental impact of minimalism is profound:</p>
      
      <h3 id="reduced-waste">Reduced Waste</h3>
      <p>By purchasing fewer items and choosing quality over quantity, minimalists generate significantly less waste. This reduction extends beyond just packaging materials to include the eventual disposal of the products themselves.</p>
      
      <h3 id="energy-conservation">Energy Conservation</h3>
      <p>Fewer possessions often mean smaller living spaces, which require less energy to heat, cool, and maintain. Additionally, minimalists tend to be more conscious of their energy usage overall.</p>
      
      <h2 id="getting-started">Getting Started with Minimalism</h2>
      <p>Transitioning to a minimalist lifestyle doesn't happen overnight. It's a gradual process that begins with small, intentional changes:</p>
      
      <h3 id="decluttering">Decluttering</h3>
      <p>Start by evaluating your possessions and asking yourself whether each item truly adds value to your life. If not, consider donating, recycling, or responsibly disposing of it.</p>
      
      <h3 id="mindful-consumption">Mindful Consumption</h3>
      <p>Before making new purchases, ask yourself whether you genuinely need the item and whether it aligns with your values. Opt for quality, durability, and sustainability over trendiness or convenience.</p>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Embracing minimalism isn't just about creating a more aesthetically pleasing space—it's about making conscious choices that benefit both you and the planet. By consuming less and with greater intention, we can reduce our environmental impact while enjoying the freedom that comes with living lightly.</p>
    `,
    date: "Feb 2, 2024",
    author: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop",
    categories: ["Minimalism", "Lifestyle", "Sustainability"],
    tags: ["minimalism", "sustainability", "eco-friendly", "intentional living"]
  },
  {
    id: "2",
    slug: "elevating-style-minimal-environmental-footprint",
    title: "Elevating Your Style with Minimal Environmental Footprint",
    excerpt: "How to build a sustainable wardrobe that's both stylish and kind to the planet.",
    content: `
      <p>Fashion is one of the world's most polluting industries, but that doesn't mean you have to sacrifice style for sustainability. By adopting a minimalist approach to your wardrobe, you can reduce your environmental impact while still expressing your personal style.</p>
      
      <h2 id="fast-fashion-problem">The Fast Fashion Problem</h2>
      <p>Fast fashion has revolutionized the way we consume clothing, but at a significant environmental cost. The rapid production cycles, cheap materials, and planned obsolescence lead to mountains of textile waste and excessive resource consumption.</p>
      
      <h2 id="capsule-wardrobe">The Capsule Wardrobe Solution</h2>
      <p>A capsule wardrobe consists of a limited selection of versatile, high-quality items that can be mixed and matched to create numerous outfits. This approach not only reduces consumption but also simplifies your daily routine.</p>
      
      <h3 id="building-capsule">Building Your Capsule</h3>
      <p>Start by selecting a color palette that works well together. Choose neutral base colors supplemented with a few accent pieces that reflect your personal style. Focus on versatility—each item should work with multiple others in your collection.</p>
      
      <h3 id="quality-over-quantity">Quality Over Quantity</h3>
      <p>Invest in well-made pieces that will last for years rather than disposable fashion that needs frequent replacement. Consider factors like fabric quality, construction, and timeless design when making purchases.</p>
      
      <h2 id="sustainable-materials">Sustainable Materials</h2>
      <p>When adding to your wardrobe, look for items made from sustainable materials like organic cotton, hemp, Tencel, or recycled fabrics. These options have a lower environmental impact than conventional alternatives.</p>
      
      <h2 id="ethical-sourcing">Ethical Sourcing</h2>
      <p>Support brands that prioritize fair labor practices and transparency in their supply chains. Ethical production ensures that your stylish choices don't come at the expense of workers' wellbeing.</p>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>By adopting a minimalist approach to fashion, you can create a wardrobe that expresses your personal style while minimizing your environmental footprint. Remember that sustainability is a journey, not a destination—small, consistent changes can make a significant impact over time.</p>
    `,
    date: "Feb 5, 2024",
    author: {
      name: "Jamie Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&h=600&fit=crop",
    categories: ["Minimalism", "Fashion", "Sustainability"],
    tags: ["sustainable fashion", "capsule wardrobe", "ethical clothing", "minimal style"]
  },
  {
    id: "3",
    slug: "designing-tranquility-minimalist-spaces",
    title: "Designing Tranquility: How Minimalist Spaces Support Eco-Friendly Living",
    excerpt: "Create calm, sustainable living spaces that nurture both you and the environment.",
    content: `
      <p>Our physical environment has a profound impact on our mental wellbeing. Minimalist design principles can help create spaces that feel calm and peaceful while also supporting sustainable living practices.</p>
      
      <h2 id="principles-minimalist-design">Principles of Minimalist Design</h2>
      <p>Minimalist spaces are characterized by simplicity, functionality, and intentionality. Every element serves a purpose, contributing to a sense of order and tranquility.</p>
      
      <h3 id="decluttered-spaces">Decluttered Spaces</h3>
      <p>Clear surfaces and organized storage reduce visual noise and create a sense of calm. This doesn't mean eliminating all possessions, but rather being selective about what you keep and how you display it.</p>
      
      <h3 id="quality-materials">Quality Materials</h3>
      <p>Choose natural, sustainable materials that age beautifully and connect your space to the natural world. Wood, stone, glass, and natural fibers add warmth and texture while minimizing environmental impact.</p>
      
      <h2 id="sustainable-elements">Sustainable Elements</h2>
      <p>Incorporating eco-friendly features into your minimalist space enhances both aesthetics and sustainability:</p>
      
      <h3 id="energy-efficiency">Energy Efficiency</h3>
      <p>Maximize natural light to reduce electricity usage. Consider energy-efficient appliances and lighting to further minimize your environmental footprint.</p>
      
      <h3 id="indoor-plants">Indoor Plants</h3>
      <p>Plants improve air quality, enhance wellbeing, and add life to minimalist spaces. Choose low-maintenance varieties that thrive in your specific light conditions.</p>
      
      <h2 id="mindful-decor">Mindful Décor</h2>
      <p>Select a few meaningful items that bring you joy rather than filling your space with decorative objects. Consider the origin and lifecycle of each piece—opt for handcrafted, vintage, or upcycled items when possible.</p>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>By applying minimalist principles to your living space, you can create an environment that supports both your wellbeing and your environmental values. Remember that the goal isn't perfection but rather intentionality—creating a space that reflects what matters most to you while treading lightly on the planet.</p>
    `,
    date: "Feb 8, 2024",
    author: {
      name: "Taylor Reed",
      avatar: "https://images.unsplash.com/photo-1532073150508-0c1df022bdd1?w=400&h=400&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&h=600&fit=crop",
    categories: ["Design", "Minimalism", "Sustainability"],
    tags: ["interior design", "sustainable living", "minimalist home", "eco-friendly"]
  },
  {
    id: "4",
    slug: "wander-wisely-sustainable-travel",
    title: "Wander Wisely: Sustainable Travel Tips for the Minimalist Explorer",
    excerpt: "Discover how to see the world with minimal impact and maximum experience.",
    content: `
      <p>Travel enriches our lives with new perspectives and experiences, but it can also take a toll on the environment. Fortunately, by adopting minimalist principles, we can explore the world more sustainably without sacrificing the quality of our adventures.</p>
      
      <h2 id="pack-light">Pack Light, Travel Right</h2>
      <p>Minimalist packing isn't just about convenience—it's also environmentally responsible. Lighter luggage means transportation vehicles consume less fuel to carry your belongings.</p>
      
      <h3 id="versatile-items">Choose Versatile Items</h3>
      <p>Select clothing and accessories that can be mixed and matched, function in multiple settings, and adapt to different weather conditions. This allows you to bring fewer items while still having appropriate options for various situations.</p>
      
      <h3 id="digital-minimalism">Embrace Digital Minimalism</h3>
      <p>Instead of carrying guidebooks, maps, and travel documents, store digital versions on your devices. This reduces weight and paper consumption while keeping essential information accessible.</p>
      
      <h2 id="sustainable-transport">Sustainable Transportation</h2>
      <p>How you move between and within destinations significantly impacts your travel footprint:</p>
      
      <h3 id="slow-travel">Slow Travel</h3>
      <p>Rather than rushing between multiple destinations, spend more time in fewer places. This approach reduces transportation emissions while allowing for deeper experiences and connections with local communities.</p>
      
      <h3 id="public-transit">Prioritize Public Transit</h3>
      <p>Use trains, buses, and other public transportation options when possible. These shared modes of transport generally have lower per-passenger emissions than private vehicles or planes for shorter distances.</p>
      
      <h2 id="mindful-consumption">Mindful Consumption</h2>
      <p>Apply minimalist principles to your spending and consumption habits while traveling:</p>
      
      <h3 id="local-experiences">Choose Experiences Over Souvenirs</h3>
      <p>Instead of collecting physical mementos that may eventually become clutter, invest in meaningful experiences that create lasting memories. If you do purchase souvenirs, select locally-made items that support traditional crafts and minimize transportation impacts.</p>
      
      <h3 id="reduce-waste">Reduce Waste</h3>
      <p>Carry reusable items like water bottles, utensils, and shopping bags to minimize single-use plastic consumption. Be mindful of water usage, particularly in regions experiencing scarcity.</p>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Minimalist travel isn't about deprivation—it's about focusing on what truly matters: authentic experiences, cultural connections, and responsible enjoyment of our planet's beauty. By traveling with intention and awareness, we can explore the world while helping to preserve it for future wanderers.</p>
    `,
    date: "Feb 12, 2024",
    author: {
      name: "Jordan Chen",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop",
    categories: ["Travel", "Minimalism", "Sustainability"],
    tags: ["sustainable travel", "eco-tourism", "minimalist packing", "responsible travel"]
  },
  {
    id: "5",
    slug: "digital-minimalism-sustainable-tech",
    title: "Digital Minimalism: Sustainable Approaches to Technology",
    excerpt: "How to create healthier relationships with technology while reducing your digital carbon footprint.",
    content: `
      <p>In our hyperconnected world, digital minimalism offers a pathway to more intentional technology use that benefits both personal wellbeing and environmental sustainability.</p>
      
      <h2 id="digital-clutter">The Problem of Digital Clutter</h2>
      <p>Just as physical clutter can create stress and consume resources, digital clutter—endless apps, notifications, subscriptions, and files—can overwhelm us while consuming energy and processing power.</p>
      
      <h2 id="environmental-impact">The Environmental Impact of Digital Life</h2>
      <p>Our digital activities have tangible environmental consequences, from the manufacturing of devices to the energy consumed by data centers that power our cloud services.</p>
      
      <h3 id="device-lifecycle">Device Lifecycle</h3>
      <p>The extraction of rare minerals, manufacturing processes, and eventual disposal of electronic devices all contribute to environmental degradation. By extending the lifespan of our devices, we can significantly reduce this impact.</p>
      
      <h3 id="data-storage">Data Storage</h3>
      <p>The seemingly infinite cloud is actually powered by massive data centers that consume substantial energy. Being selective about what we store and stream helps reduce this energy demand.</p>
      
      <h2 id="digital-minimalism-practices">Digital Minimalism Practices</h2>
      <p>Here are some strategies to cultivate a more sustainable digital life:</p>
      
      <h3 id="device-optimization">Device Optimization</h3>
      <p>Regularly declutter your digital spaces by removing unused apps, deleting unnecessary files, and organizing what remains. Optimize settings to reduce energy consumption and extend battery life.</p>
      
      <h3 id="intentional-use">Intentional Use</h3>
      <p>Establish boundaries around technology use. Consider designating tech-free times and spaces, using focused modes to minimize distractions, and being selective about which platforms deserve your attention.</p>
      
      <h3 id="longevity-focus">Focus on Longevity</h3>
      <p>Rather than upgrading devices based on marketing cycles, maintain and repair your existing technology until it truly no longer meets your needs. When replacement is necessary, consider refurbished options and proper recycling of old devices.</p>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Digital minimalism isn't about rejecting technology but rather cultivating a more thoughtful relationship with it. By being intentional about our digital lives, we can reduce stress, increase focus, and minimize our environmental footprint—all while still enjoying the benefits that technology has to offer.</p>
    `,
    date: "Feb 15, 2024",
    author: {
      name: "Morgan Lee",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=600&fit=crop",
    categories: ["Technology", "Minimalism", "Sustainability"],
    tags: ["digital minimalism", "sustainable tech", "eco-friendly technology", "digital wellbeing"]
  },
  {
    id: "6",
    slug: "mindful-consumption-art-of-buying-less",
    title: "Mindful Consumption: The Art of Buying Less But Better",
    excerpt: "Transform your relationship with consumption through quality-focused, intentional purchasing.",
    content: `
      <p>In a world that equates consumption with happiness, mindful purchasing represents a radical shift—focusing on quality over quantity and impact over convenience.</p>
      
      <h2 id="overconsumption-problem">The Overconsumption Problem</h2>
      <p>Our culture of consumption has significant consequences, from environmental degradation to personal financial strain and mental clutter. Breaking free from this cycle requires a fundamental shift in how we approach purchasing decisions.</p>
      
      <h2 id="quality-principles">The Quality Principles</h2>
      <p>Mindful consumption isn't about deprivation—it's about elevation. By focusing on quality, we can actually enhance our experience while reducing overall consumption.</p>
      
      <h3 id="durability">Durability</h3>
      <p>Seek out items designed to last years or even decades. This often means investing more upfront but spending less over time due to fewer replacements.</p>
      
      <h3 id="versatility">Versatility</h3>
      <p>Choose items that serve multiple purposes or work well in various contexts. This reduces the total number of possessions needed while maximizing utility.</p>
      
      <h3 id="repairability">Repairability</h3>
      <p>Consider whether an item can be maintained and repaired when evaluating a purchase. Companies that offer repair services or replaceable parts demonstrate commitment to product longevity.</p>
      
      <h2 id="mindful-purchasing-framework">A Framework for Mindful Purchasing</h2>
      <p>These questions can help guide more intentional consumption habits:</p>
      
      <h3 id="need-vs-want">Need vs. Want</h3>
      <p>Distinguish between true needs and momentary desires. For wants, consider implementing a waiting period before purchasing to ensure the desire isn't simply a passing impulse.</p>
      
      <h3 id="origin-impact">Origin and Impact</h3>
      <p>Research where and how products are made. Support companies with transparent supply chains and demonstrated commitment to ethical and sustainable practices.</p>
      
      <h3 id="lifecycle-consideration">Full Lifecycle Consideration</h3>
      <p>Think about what will happen to the item at the end of its useful life. Can it be recycled, composted, or repurposed? Products designed with their end-of-life in mind generally have less environmental impact.</p>
      
      <h2 id="conclusion">Conclusion</h2>
      <p>Mindful consumption represents a return to quality-focused values that benefit both individuals and the planet. By buying less but better, we can reduce waste, support ethical production, and cultivate a more meaningful relationship with our possessions.</p>
    `,
    date: "Feb 18, 2024",
    author: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop"
    },
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
    categories: ["Lifestyle", "Minimalism", "Sustainability"],
    tags: ["conscious consumption", "quality over quantity", "sustainable living", "minimalism"]
  }
];

// Get all posts
export const getAllPosts = (): Post[] => {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get post by slug
export const getPostBySlug = (slug: string): Post | undefined => {
  return posts.find(post => post.slug === slug);
};

// Get related posts (excluding the current post)
export const getRelatedPosts = (slug: string, limit: number = 3): Post[] => {
  const currentPost = getPostBySlug(slug);
  
  if (!currentPost) return [];
  
  // Find posts with similar categories
  return posts
    .filter(post => 
      post.slug !== slug && 
      post.categories.some(category => 
        currentPost.categories.includes(category)
      )
    )
    .sort((a, b) => {
      // Count matching categories
      const aMatches = a.categories.filter(category => 
        currentPost.categories.includes(category)
      ).length;
      
      const bMatches = b.categories.filter(category => 
        currentPost.categories.includes(category)
      ).length;
      
      return bMatches - aMatches;
    })
    .slice(0, limit);
};

// Search posts
export const searchPosts = (query: string): Post[] => {
  const searchTerm = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.excerpt.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.categories.some(category => 
      category.toLowerCase().includes(searchTerm)
    ) ||
    post.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    )
  );
};

// Get all categories
export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  
  posts.forEach(post => {
    post.categories.forEach(category => {
      categories.add(category);
    });
  });
  
  return Array.from(categories).sort();
};

// Get posts by category
export const getPostsByCategory = (category: string): Post[] => {
  return posts
    .filter(post => 
      post.categories.some(cat => 
        cat.toLowerCase() === category.toLowerCase()
      )
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get all tags
export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tags.add(tag);
    });
  });
  
  return Array.from(tags).sort();
};

// Get featured post
export const getFeaturedPost = (): Post => {
  // For simplicity, using the first post as featured
  return posts[0];
};
