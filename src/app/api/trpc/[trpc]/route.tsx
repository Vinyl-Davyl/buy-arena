import { appRouter } from "@/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest, NextResponse } from "next/server";

const allowedOrigins = [
  "https://buy-arena.vercel.app",
  "https://buy-arena-git-development-vinyldavyls-projects.vercel.app",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  return NextResponse.json({}, { headers: corsHeaders });
}

async function handler(req: NextRequest) {
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req: req as unknown as Request,
    router: appRouter,
    // @ts-expect-error context already passed from express middleware
    createContext: () => ({}),
    onError({ error }) {
      console.error("Error in tRPC handler:", error);
    },
  });

  // Add CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}
