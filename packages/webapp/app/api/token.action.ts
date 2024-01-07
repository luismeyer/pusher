"use server";

import { auth } from "./auth";

export const tokenAction = async (): Promise<true> => {
  auth();

  return true;
};
