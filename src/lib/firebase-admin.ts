import * as admin from "firebase-admin";

if (!admin.apps.length) {
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

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();

export default admin;
