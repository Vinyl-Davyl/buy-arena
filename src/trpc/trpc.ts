import { User } from "@/payload-types";
import { TRPCError, initTRPC } from "@trpc/server";
import { NextRequest } from "next/server";
import { getPayloadClient } from "@/get-payload";

// Define the context type
export type Context = {
  req: NextRequest;
  user?: User | null;
};

const t = initTRPC.context<Context>().create();
const middleware = t.middleware;

const isAuth = middleware(async ({ ctx, next }) => {
  const { req } = ctx;
  const payload = await getPayloadClient();

  // Get the token from the Authorization header
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  try {
    // Find the user by token
    const { docs: users } = await payload.find({
      collection: "users",
      where: {
        token: {
          equals: token,
        },
      },
    });

    const user = users[0] as User | undefined;

    if (!user || !user.id) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuth);
