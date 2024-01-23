import { FlowsResponse } from "@pusher/shared";
import { auth } from "./auth";
import { flowsByUser } from "./flowDB";
import { res } from "./response";

export async function flowsAction(): Promise<FlowsResponse> {
  const user = await auth();
  if (!user) {
    return res.unauth;
  }

  try {
    const flows = await flowsByUser(user.id);

    return res.success(flows);
  } catch (e) {
    if (e instanceof Error) {
      return res.error(e.message);
    }

    return res.error("unknown error");
  }
}
