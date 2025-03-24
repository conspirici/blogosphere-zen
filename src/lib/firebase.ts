
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your Firebase API key
  authDomain: "YOUR_AUTH_DOMAIN", // Replace with your Firebase auth domain
  projectId: "YOUR_PROJECT_ID", // Replace with your Firebase project ID
  storageBucket: "YOUR_STORAGE_BUCKET", // Replace with your Firebase storage bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Firebase messaging sender ID
  appId: "YOUR_APP_ID" // Replace with your Firebase app ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

export { auth, storage };
