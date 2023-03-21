import { Console } from "@/components/console";
import { useLoadFlow } from "../../hooks/useLoadFlow";

export default function ConsolePage() {
  const loading = useLoadFlow();

  return <Console loading={loading} />;
}
