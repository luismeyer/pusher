import { NextApiHandler } from "next";

import { validateFlow } from "@/api/validateFlow";
import { Flow } from "@pusher/shared";
import { saveFlow } from "../../api/flowDB";

type ErrorResponse = {
  type: "error";
  message: string;
};

type SuccessResponse = {
  type: "success";
};

export type SubmitResponse = ErrorResponse | SuccessResponse;

const handler: NextApiHandler<SubmitResponse> = async (req, res) => {
  const { flow } = req.query;

  if (typeof flow !== "string") {
    return res
      .status(404)
      .json({ type: "error", message: "Wrong flow parameter" });
  }

  let flowPayload: Flow;

  try {
    const decodedFlow = decodeURIComponent(flow);

    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      return res.status(404).json({ type: "error", message: e.message });
    }

    return res
      .status(404)
      .json({ type: "error", message: "Flow parsing error" });
  }

  await saveFlow(flowPayload);

  return res.status(200).json({ type: "success" });
};

export default handler;
