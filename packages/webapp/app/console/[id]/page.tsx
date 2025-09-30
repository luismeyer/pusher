import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Actions } from "@/components/actions";
import { loadAction } from "@/app/api/load.action";
import { TopBar } from "@/components/top-bar";
import { Zoom } from "@/components/zoom";
import { Provider } from "./provider";

type ConsolePage = {
	params: { id: string };
};

export function App({ id }: { id: string }) {
	return (
		<Provider flowPromise={loadAction(id)} id={id}>
			<TopBar />

			<Actions />

			<Zoom />
		</Provider>
	);
}

export default async function ConsolePage(props: ConsolePage) {
	const session = await getServerSession();
	if (!session?.user) {
		redirect("/login");
	}

	return (
		<main>
			<div className="p-4 bg-gray-100 h-screen w-screen">
				<App id={props.params.id} />
			</div>
		</main>
	);
}
