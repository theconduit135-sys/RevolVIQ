import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "@/graphql/schema";
import { resolvers } from "@/graphql/resolvers";
import { createContext } from "@/graphql/context";
import { NextRequest } from "next/server";

// Force dynamic rendering to prevent build-time evaluation
export const dynamic = 'force-dynamic';

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Using 'any' for Context to bypass strict TS check during deployment
const handler = startServerAndCreateNextHandler<NextRequest, any>(server, {
    context: async (req) => createContext(req),
});

export async function GET(request: NextRequest) {
    return handler(request);
}

export async function POST(request: NextRequest) {
    return handler(request);
}
