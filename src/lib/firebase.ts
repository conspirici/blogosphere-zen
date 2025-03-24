
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy } from "firebase/firestore";
import { toast } from "sonner";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIy28aihffLgaRWaNhYr8eNg2Mib_hvkA",
  authDomain: "soul-brew-blog.firebaseapp.com",
  projectId: "soul-brew-blog",
  storageBucket: "soul-brew-blog.firebasestorage.app",
  messagingSenderId: "100365349543",
  appId: "1:100365349543:web:27d10618e1f8957fb42182"
};

// Initialize Firebase - prevent duplicate initialization
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const provider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    toast.error("Failed to sign in with Google. Please make sure third-party cookies are enabled and try again.");
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
    toast.success("Successfully signed out");
  } catch (error) {
    console.error("Error signing out: ", error);
    toast.error("Failed to sign out");
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

export { auth, storage, firestore };
