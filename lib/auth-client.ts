import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
  baseURL: "https://nextblog-black-seven.vercel.app",
});
