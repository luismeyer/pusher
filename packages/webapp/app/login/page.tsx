import { LoginButton } from "@/components/login-button";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session?.user) {
    redirect("/console");
  }

  return (
    <main className="flex h-screen items-center justify-center">
      <LoginButton />
    </main>
  );
}
