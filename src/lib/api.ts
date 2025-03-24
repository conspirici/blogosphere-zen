import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp,
  updateDoc
} from "firebase/firestore";
import { firestore } from "./firebase";
import { v4 as uuidv4 } from "uuid";

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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Collection references
const postsCollection = collection(firestore, "posts");
const categoriesCollection = collection(firestore, "categories");

// Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const q = query(postsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Post;
      // Format the date for display
      posts.push({
        ...data,
        date: data.date || new Date(data.createdAt?.toDate() || new Date()).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })
      });
    });
    
    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
};

// Get post by slug
export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  try {
    const q = query(postsCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return undefined;
    }
    
    const postDoc = querySnapshot.docs[0];
    const postData = postDoc.data() as Post;
    
    return {
      ...postData,
      date: postData.date || new Date(postData.createdAt?.toDate() || new Date()).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
  } catch (error) {
    console.error("Error getting post by slug:", error);
    throw error;
  }
};

// Create or update post
export const savePost = async (post: Post, isNew = false): Promise<Post> => {
  try {
    const postToSave: Post = { ...post };
    
    // Generate ID for new posts
    if (isNew) {
      postToSave.id = uuidv4();
      postToSave.createdAt = serverTimestamp() as Timestamp;
    }
    
    postToSave.updatedAt = serverTimestamp() as Timestamp;
    
    // Use the post ID as the document ID
    const postRef = doc(postsCollection, postToSave.id);
    await setDoc(postRef, postToSave, { merge: true });
    
    return postToSave;
  } catch (error) {
    console.error("Error saving post:", error);
    throw error;
  }
};

// Delete post
export const deletePost = async (postId: string): Promise<void> => {
  try {
    const postRef = doc(postsCollection, postId);
    await deleteDoc(postRef);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// Get related posts (excluding the current post)
export const getRelatedPosts = async (slug: string, limit: number = 3): Promise<Post[]> => {
  try {
    const currentPost = await getPostBySlug(slug);
    
    if (!currentPost) return [];
    
    const allPosts = await getAllPosts();
    
    // Find posts with similar categories
    return allPosts
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
  } catch (error) {
    console.error("Error getting related posts:", error);
    return [];
  }
};

// Search posts
export const searchPosts = async (query: string): Promise<Post[]> => {
  try {
    const allPosts = await getAllPosts();
    const searchTerm = query.toLowerCase();
    
    return allPosts.filter(post => 
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
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
};

// Get all categories
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const querySnapshot = await getDocs(categoriesCollection);
    
    if (!querySnapshot.empty) {
      // If we have categories stored in Firestore, use those
      const categories: string[] = [];
      querySnapshot.forEach((doc) => {
        categories.push(doc.id);
      });
      return categories.sort();
    } else {
      // Otherwise extract from posts
      const posts = await getAllPosts();
      const categories = new Set<string>();
      
      posts.forEach(post => {
        post.categories.forEach(category => {
          categories.add(category);
        });
      });
      
      return Array.from(categories).sort();
    }
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
};

// Save a new category
export const saveCategory = async (category: string): Promise<void> => {
  try {
    const categoryRef = doc(categoriesCollection, category);
    await setDoc(categoryRef, { name: category });
  } catch (error) {
    console.error("Error saving category:", error);
    throw error;
  }
};

// Get posts by category
export const getPostsByCategory = async (category: string): Promise<Post[]> => {
  try {
    const allPosts = await getAllPosts();
    
    return allPosts
      .filter(post => 
        post.categories.some(cat => 
          cat.toLowerCase() === category.toLowerCase()
        )
      );
  } catch (error) {
    console.error("Error getting posts by category:", error);
    return [];
  }
};

// Get all tags
export const getAllTags = async (): Promise<string[]> => {
  try {
    const posts = await getAllPosts();
    const tags = new Set<string>();
    
    posts.forEach(post => {
      post.tags.forEach(tag => {
        tags.add(tag);
      });
    });
    
    return Array.from(tags).sort();
  } catch (error) {
    console.error("Error getting tags:", error);
    return [];
  }
};

// Get featured post
export const getFeaturedPost = async (): Promise<Post | null> => {
  try {
    const posts = await getAllPosts();
    // For simplicity, using the first post as featured
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error("Error getting featured post:", error);
    return null;
  }
};
