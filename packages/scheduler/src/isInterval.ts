import { Flow } from "@pusher/shared";

export const isInterval = (text: string): text is Flow["interval"] =>
  text === "6h" || text === "12h";
