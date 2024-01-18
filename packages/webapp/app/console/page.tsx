import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { AuthModal } from "@/components/authModal";
import { Canvas } from "@/components/canvas";
import { TopBar } from "@/components/top-bar";
import { Zoom } from "@/components/zoom";

export default async function ConsolePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <AuthModal />

      <TopBar />

      <div className="p-4 bg-gray-100 h-screen w-screen">
        <Canvas />
      </div>

      <Zoom />
    </main>
  );
}
