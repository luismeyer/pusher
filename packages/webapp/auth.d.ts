import type { User } from "@pusher/shared";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & User;
  }
}
