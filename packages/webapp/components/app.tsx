import { loadAction } from "@/app/api/load.action";

import { Canvas } from "./canvas";

type AppProps = {
  id: string;
};

export async function App({ id }: AppProps) {
  const flow = await loadAction(id);

  return (
    <Canvas id={id} flow={flow.type === "success" ? flow.data : undefined} />
  );
}
