import Link from "next/link";
import { redirect } from "next/navigation";

import { flowsAction } from "@/app/api/flows.action";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";

export async function Flows() {
	const res = await flowsAction();

	if (res.type === "unauthorized") {
		redirect("/login");
	}

	if (res.type === "error") {
		return <div>Error {res.message}</div>;
	}

	return (
		<div className="grid grid-cols-3 gap-8">
			{res.data?.map((flow) => (
				<Card key={flow.id} className="flex flex-col p-4 gap-5 w-full">
					<CardHeader className="p-0">
						<div className="flex items-center justify-between">
							<CardTitle className="text-2xl">{flow.name}</CardTitle>
							{flow.disabled && <Badge variant="destructive">Disabled</Badge>}
						</div>

						<CardDescription>
							{flow.disabled ? "Disabled" : "Enabled"}
						</CardDescription>
					</CardHeader>

					<CardContent className="p-0">
						<p>Interval: {flow.interval}</p>
						<p>Fails: {flow.fails}</p>
						<p>Updated: {flow.updatedAt ?? "unknown"}</p>
					</CardContent>

					<CardFooter className="p-0 flex flex-row-reverse items-center gap-2">
						{/* TODO implement */}
						<Button variant="destructive">delete</Button>

						<Button asChild>
							<Link href={`/console/${flow.id}`}>edit</Link>
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	);
}
