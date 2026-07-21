import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  accessToken: string;
  role: "ADMIN" | "SUPER_ADMIN";
  permissions: string[];
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
