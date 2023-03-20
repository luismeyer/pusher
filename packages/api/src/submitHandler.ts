import { RequestHandler } from "express";

import { Flow, SubmitResponse } from "@pusher/shared";

import { saveFlow } from "./flowDB";
import { validateFlow } from "./validateFlow";

export const submitHandler: RequestHandler<SubmitResponse> = async (
  req,
  res
) => {
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
