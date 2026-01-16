import { db, storage } from "@/lib/firebase-admin";
import { Context } from "@/graphql/context";
import { GraphQLScalarType, Kind } from "graphql";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2024-12-18.acacia" as any,
});

const DateTime = new GraphQLScalarType({
    name: "DateTime",
    description: "Date custom scalar type",
    serialize(value: any) {
        // If Firestore Timestamp, convert to Date first
        if (value && typeof value.toDate === 'function') {
            return value.toDate().toISOString();
        }
        return value instanceof Date ? value.toISOString() : value;
    },
    parseValue(value: any) {
        return new Date(value);
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            return new Date(ast.value);
        }
        return null;
    },
});

const JSONScalar = new GraphQLScalarType({
    name: "JSON",
    description: "JSON custom scalar type",
    serialize(value: any) { return value; },
    parseValue(value: any) { return value; },
    parseLiteral(ast) {
        if (ast.kind === Kind.OBJECT) return "json_object";
        return null;
    }
});

// --- Auth Helpers ---

const requireAuth = (ctx: Context) => {
    if (!ctx.uid) throw new Error("Unauthorized");
    return ctx.uid;
};

const requireOrgMember = async (uid: string, orgId: string) => {
    // Check if owner
    const orgSnap = await db.collection("organizations").doc(orgId).get();
    if (!orgSnap.exists) throw new Error("Organization not found");
    const org = orgSnap.data();
    if (org?.ownerUid === uid) return true;

    // Check membership
    const memberSnap = await db.collection("organizations").doc(orgId).collection("members").where("uid", "==", uid).get();
    if (!memberSnap.empty) return true;

    throw new Error("Access denied: Not a member of this organization");
};

// --- Resolvers ---

export const resolvers = {
    DateTime,
    JSON: JSONScalar,

    Query: {
        viewer: async (_: any, __: any, ctx: Context) => {
            const uid = requireAuth(ctx);
            const userSnap = await db.collection("users").doc(uid).get();
            return { uid, user: userSnap.data(), orgs: [] };
        },

        organization: async (_: any, { id }: { id: string }, ctx: Context) => {
            const uid = requireAuth(ctx);
            await requireOrgMember(uid, id);
            const snap = await db.collection("organizations").doc(id).get();
            return { id: snap.id, ...snap.data() };
        },

        organizations: async (_: any, __: any, ctx: Context) => {
            const uid = requireAuth(ctx);
            const memberSnaps = await db.collectionGroup("members").where("uid", "==", uid).get();
            const orgIds = memberSnaps.docs.map((d: any) => d.data().orgId);
            if (orgIds.length === 0) return [];

            const uniqueOrgIds = Array.from(new Set(orgIds));
            const orgRefs = uniqueOrgIds.map(id => db.collection("organizations").doc(id));

            const orgSnaps = await db.getAll(...orgRefs);
            return orgSnaps.map((s: any) => ({ id: s.id, ...s.data() }));
        },

        leads: async (_: any, { status, pagination }: { status?: string, pagination?: any }, ctx: Context) => {
            const uid = requireAuth(ctx);
            console.warn("Global leads query not fully implemented without orgId input.");
            return { nodes: [], pageInfo: { hasNextPage: false } };
        },

        products: async (_: any, { active }: { active?: boolean }, ctx: Context) => {
            const uid = requireAuth(ctx);
            return [];
        }
    },

    Mutation: {
        syncViewer: async (_: any, __: any, ctx: Context) => {
            const uid = requireAuth(ctx);
            const userRef = db.collection("users").doc(uid);
            await userRef.set({
                uid,
                email: ctx.email || "",
                updatedAt: new Date(),
                displayName: ctx.token?.name || "",
                photoUrl: ctx.token?.picture || "",
            }, { merge: true });
            const snap = await userRef.get();
            return { uid, user: snap.data(), orgs: [] };
        },

        createOrganization: async (_: any, { input }: { input: any }, ctx: Context) => {
            const uid = requireAuth(ctx);
            const { name, slug } = input;
            const ref = db.collection("organizations").doc();
            const now = new Date();

            const newOrg = {
                id: ref.id,
                ownerUid: uid,
                name,
                slug,
                createdAt: now,
                updatedAt: now,
            };

            await ref.set(newOrg);
            await ref.collection("members").add({
                orgId: ref.id,
                uid,
                role: "OWNER",
                createdAt: now
            });
            return newOrg;
        },

        createLead: async (_: any, { input }: { input: any }, ctx: Context) => {
            const uid = requireAuth(ctx);
            await requireOrgMember(uid, input.orgId);

            const ref = db.collection("leads").doc();
            const now = new Date();
            const lead = {
                id: ref.id,
                createdByUid: uid,
                ...input,
                status: "NEW", // Default
                notesCount: 0,
                createdAt: now,
                updatedAt: now
            };
            await ref.set(lead);
            return lead;
        },

        uploadDocument: async (_: any, { input }: { input: any }, ctx: Context) => {
            const uid = requireAuth(ctx);
            await requireOrgMember(uid, input.orgId);

            const { filename, mimeType, sizeBytes, orgId, entityType, entityId } = input;

            // Generate storage path
            const storagePath = `orgs/${orgId}/uploads/${Date.now()}_${filename}`;

            // Create Doc Record (Uploads collection per rules)
            const ref = db.collection("uploads").doc();
            const now = new Date();
            const docData = {
                id: ref.id,
                orgId,
                ownerUid: uid,
                entityType,
                entityId,
                filename,
                mimeType,
                sizeBytes,
                storagePath,
                createdAt: now
            };
            await ref.set(docData);

            // Generate Signed URL
            const bucket = storage.bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
            const file = bucket.file(storagePath);
            const [signedUploadUrl] = await file.getSignedUrl({
                version: 'v4',
                action: 'write',
                expires: Date.now() + 60 * 60 * 1000,
                contentType: mimeType,
            });

            return { doc: docData, signedUploadUrl };
        },

        createScan: async (_: any, { input }: { input: any }, ctx: Context) => {
            const uid = requireAuth(ctx);
            const { orgId, leadId, input: scanInput } = input;
            await requireOrgMember(uid, orgId);

            const ref = db.collection("scans").doc();
            const now = new Date();
            const scan = {
                id: ref.id,
                orgId,
                ownerUid: uid,
                leadId,
                status: "QUEUED",
                input: scanInput,
                result: null,
                riskFlags: [],
                createdAt: now,
                updatedAt: now
            };
            await ref.set(scan);
            return scan;
        },

        createOrder: async (_: any, { input }: { input: any }, ctx: Context) => {
            const uid = requireAuth(ctx);
            const { orgId, items, successUrl, cancelUrl } = input;
            await requireOrgMember(uid, orgId);

            const lineItems = [];
            let totalCents = 0;

            for (const item of items) {
                const pSnap = await db.collection("products").doc(item.productId).get();
                if (!pSnap.exists) throw new Error(`Product ${item.productId} not found`);
                const pData = pSnap.data();

                if (pData?.stripePriceId) {
                    lineItems.push({
                        price: pData.stripePriceId,
                        quantity: item.quantity
                    });
                    totalCents += (pData.amountCents || 0) * item.quantity;
                }
            }

            if (lineItems.length === 0) throw new Error("No valid items found");

            // Purchases collection per rules
            const orderRef = db.collection("purchases").doc();
            const now = new Date();

            // Create Stripe Session
            const session = await stripe.checkout.sessions.create({
                mode: "payment",
                payment_method_types: ["card", "klarna", "affirm"],
                line_items: lineItems,
                success_url: successUrl,
                cancel_url: cancelUrl,
                client_reference_id: orderRef.id,
                metadata: {
                    orgId,
                    uid,
                    orderId: orderRef.id
                }
            });

            const order = {
                id: orderRef.id,
                orgId,
                buyerUid: uid,
                status: "CREATED",
                currency: "usd",
                subtotalCents: totalCents,
                totalCents: totalCents,
                items: items.map((i: any) => ({ ...i, amountCents: 0, name: "Product" })),
                stripeCheckoutSessionId: session.id,
                createdAt: now,
                updatedAt: now
            };

            await orderRef.set(order);

            return { order, stripeCheckoutUrl: session.url };
        }
    },

    Viewer: {
        orgs: async (parent: any) => {
            const uid = parent.uid;
            const memberSnaps = await db.collectionGroup("members").where("uid", "==", uid).get();
            const orgIds = memberSnaps.docs.map((d: any) => d.data().orgId);
            if (orgIds.length === 0) return [];
            const uniqueOrgIds = Array.from(new Set(orgIds));
            const orgRefs = uniqueOrgIds.map(id => db.collection("organizations").doc(id));
            const orgSnaps = await db.getAll(...orgRefs);
            return orgSnaps.map((s: any) => ({ id: s.id, ...s.data() }));
        }
    },

    Organization: {
        members: async (parent: any) => {
            const snap = await db.collection("organizations").doc(parent.id).collection("members").get();
            return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
        }
    }
};
