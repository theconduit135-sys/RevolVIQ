import * as admin from "firebase-admin";

// Only initialize if not during build (check for runtime)
const isBuilding = typeof window === 'undefined' && (process.env.CI === 'true' || process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);if (!admin.apps.length && !isBuilding) {
  try {
    // Attempt standard initialization
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "revolv-80ee0",
    });
  } catch (error) {
    console.warn("Firebase Admin: using insecure/mock auth for build/dev due to missing credentials.");
    // Fallback for build time
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: "revolv-80ee0",
      });
    }
  }
}

// Create mock objects for build time
const mockAuth = {
  verifyIdToken: async () => ({ uid: 'mock', email: 'mock@example.com' })
} as any;

const mockDb = {} as any;
const mockStorage = {} as any;

export const auth = isBuilding ? mockAuth : (admin.apps.length > 0 ? admin.auth() : mockAuth);
export const db = isBuilding ? mockDb : (admin.apps.length > 0 ? admin.firestore() : mockDb);
export const storage = isBuilding ? mockStorage : (admin.apps.length > 0 ? admin.storage() : mockStorage);

export default admin;
