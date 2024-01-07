import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AuthModal } from "@/components/authModal";
import { Console } from "@/components/console";

export default async function ConsolePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <AuthModal />

      <Console />
    </main>
  );
}
