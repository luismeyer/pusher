import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { v4 } from "uuid";

import { Flows } from "@/components/flows";

import { flowsAction } from "../api/flows.action";

export default async function ConsolePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  const res = await flowsAction();

  if (res.type === "unauthorized") {
    redirect("/login");
  }

  if (res.type === "error") {
    return <div>Error {res.message}</div>;
  }

  return (
    <main className="p-8 grid gap-8">
      <h1 className="text-3xl">Your flows</h1>
      <Link href={`/console/${v4()}`}>New flow</Link>

      <Suspense>
        <Flows />
      </Suspense>
    </main>
  );
}
