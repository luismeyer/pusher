import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

const { PUSHER_AUTH_TOKEN } = process.env;
if (!PUSHER_AUTH_TOKEN) {
}

export const auth = async () => {
  const token = cookies().get("phr-token")?.value;

  const isTokenValid = PUSHER_AUTH_TOKEN === token;

  if (isTokenValid) {
    return true;
  }

  // const session = await getServerSession();
  // if (session?.user) {
  //   return true;
  // }

  return false;
};
