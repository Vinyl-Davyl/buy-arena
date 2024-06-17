import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "./";

// FE should know type of BE
export const trpc = createTRPCReact<AppRouter>({});
