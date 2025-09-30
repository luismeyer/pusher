import Link from "next/link";
import { v4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Cards = Array.from({ length: 4 }).map(() => v4());

export default function ConsolePage() {
	return (
		<main className="p-8 grid gap-8">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl">Your flows</h1>

				<Button asChild>
					<Link href={`/console/${v4()}`}>New flow</Link>
				</Button>
			</div>

			<div className="grid grid-cols-3 gap-8">
				{Cards.map((id) => (
					<Skeleton
						key={id}
						className="flex flex-col p-4 gap-5 w-full h-[240px]"
					/>
				))}
			</div>
		</main>
	);
}
