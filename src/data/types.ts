// src/data/types.ts
import { Timestamp } from "firebase/firestore";

// This defines the REAL data structure from your Firestore database
export interface Product {
  id: string;
  title: string;
  description: string; // This will be the English (default) description
  hashtags: string[];
  imageUrl: string;
  artisanId: string;
  createdAt: Timestamp;

  // This matches the new data from your Cloud Function
  translations: {
    hi: string; // Hindi
    ta: string; // Tamil
  };
  audio: {
    en: string; // English audio URL
    hi: string; // Hindi audio URL
    ta: string; // Tamil audio URL
  };
}
// --- ADD THIS CODE ---
// This is the blueprint for your user profiles
export interface ArtisanProfile {
  id: string;
  name: string;
  headline: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  location: {
    city: string;
    country: string;
  };
  craftType: string[];
  skills: string[];
  languages: string[];
  experience: string;
  verified: boolean;
  website?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
}