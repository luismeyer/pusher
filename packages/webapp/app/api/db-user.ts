import { createGetItem, createPutItem } from "duenamodb";

import { User } from "@pusher/shared";

import { TableName } from "./db";

export const getUser = createGetItem<User, string>(TableName, "id");

export const saveUser = createPutItem<User>(TableName);

export async function createOrReadUser(id: string) {
  let user = await getUser(id);

  if (!user) {
    user = await saveUser({
      id,
      plan: "hobby",
      updatedAt: new Date().toISOString(),
    });
  }

  return user;
}
