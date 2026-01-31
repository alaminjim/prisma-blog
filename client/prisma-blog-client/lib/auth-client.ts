import { env } from "@/env";
import { createAuthClient } from "better-auth/react";

const BACKEND_URL = env.BACKEND_URL;
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: BACKEND_URL,
});
