import { IncomingMessage } from "http";
import { auth } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";

export interface Context {
    uid: string | null;
    email: string | null;
    token?: admin.auth.DecodedIdToken;
}

export async function createContext(req: IncomingMessage | Request): Promise<Context> {
    let authHeader = "";

    if (req instanceof Request) {
        authHeader = req.headers.get("authorization") || "";
    } else if ("headers" in req) {
        // Node.js IncomingMessage
        const h = req.headers["authorization"];
        authHeader = Array.isArray(h) ? h[0] : (h || "");
    }

    const tokenString = authHeader.replace("Bearer ", "");

    if (!tokenString) {
        return { uid: null, email: null };
    }

    try {
        const decodedToken = await auth.verifyIdToken(tokenString);
        return {
            uid: decodedToken.uid,
            email: decodedToken.email || null,
            token: decodedToken,
        };
    } catch (error) {
        console.warn("Auth token verification failed:", error);
        return { uid: null, email: null };
    }
}
