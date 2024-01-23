import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Zoom } from "@/components/zoom";
import { App } from "@/components/app";
import { Suspense } from "react";

type ConsolePage = {
  params: {
    id: string;
  };
};

export default async function ConsolePage(props: ConsolePage) {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      <div className="p-4 bg-gray-100 h-screen w-screen">
        <Suspense>
          <App id={props.params.id} />
        </Suspense>
      </div>
    </main>
  );
}
