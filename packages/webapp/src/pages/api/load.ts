import { NextApiHandler } from "next";

import { getFlow } from "@/api/flowDB";
import { Flow } from "@pusher/shared";

type ErrorResponse = {
  type: "error";
  message: string;
};

type SuccessResponse = {
  type: "success";
  flow: Flow;
};

export type LoadResponse = ErrorResponse | SuccessResponse;

const handler: NextApiHandler<LoadResponse> = async (req, res) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res
      .status(404)
      .json({ type: "error", message: "Wrong flow parameter" });
  }

  const flow = await getFlow(id);

  if (!flow) {
    return res.status(404).json({ type: "error", message: "Flow not found" });
  }

  return res.status(200).json({ type: "success", flow });
};

export default handler;
