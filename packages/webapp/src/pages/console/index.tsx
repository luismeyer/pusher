import { Console } from "@/components/console";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { flowAtom } from "../../state/flow";

export default function ConsolePage() {
  const flow = useRecoilValue(flowAtom);

  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    router.push({ pathname: "/console/[id]", query: { id: flow.id } });
  }, [router, flow]);

  return <Console loading={false} />;
}
