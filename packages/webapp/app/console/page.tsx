import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    <main className="p-8">
      {res.data?.map((flow) => (
        <Card key={flow.id} className="flex p-4 justify-between items-center">
          <CardHeader className="p-0">
            <CardTitle>{flow.name}</CardTitle>
            <CardDescription>Interval {flow.interval}</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <p>disabled: {flow.disabled ? "true" : "false"}</p>
            <p>fails: {flow.fails}</p>
            <p>updated: {flow.updatedAt ?? "unknown"}</p>
          </CardContent>

          <CardFooter className="p-0 flex items-center justify-center gap-2">
            {/* TODO implement */}
            <Button variant="destructive">delete</Button>

            <Button asChild>
              <Link href={`/console/${flow.id}`}>edit</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </main>
  );
}
