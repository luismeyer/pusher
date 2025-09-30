"use client";

import { RecoilRoot } from "recoil";
import type { Flow, LoadResponse } from "@pusher/shared";
import { use } from "react";
import { flowAtom, storeFlow } from "@/state/flow";

export function Provider({
	flowPromise,
	children,
	id,
}: {
	flowPromise: Promise<LoadResponse>;
	children: React.ReactNode;
	id: string;
}) {
	const response = use(flowPromise);

	const flow = response.type === "success" ? response.data : undefined;

	return (
		<RecoilRoot
			initializeState={(snapshot) => {
				if (!flow) {
					snapshot.set(flowAtom, (pre) => ({ ...pre, id }));

					return;
				}

				storeFlow(flow, snapshot.set);
			}}
		>
			{children}
		</RecoilRoot>
	);
}
