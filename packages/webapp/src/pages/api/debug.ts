import type { NextApiRequest, NextApiResponse } from "next";
import type {} from "aws-lambda";
import { callRunner } from "@/api/callRunner";
import { Flow, RunnerResult } from "@pusher/shared";

interface Request extends NextApiRequest {
  query: {
    flow?: string;
  };
}

export default async function handler(
  req: Request,
  res: NextApiResponse<RunnerResult>
) {
  let { flow } = req.query;

  if (!flow) {
    res.status(404).json({ type: "error", message: "Missing flow" });
    return;
  }

  const decodedFlow = decodeURIComponent(flow);

  let flowPayload: Flow;

  try {
    flowPayload = JSON.parse(decodedFlow);
  } catch (e) {
    res.status(404).json({ type: "error", message: "Flow is not json" });
    return;
  }

  if (typeof flowPayload !== "object") {
    res.status(404).json({ type: "error", message: "Flow is not an object" });
    return;
  }

  const result = await callRunner(flowPayload);

  if (result.Payload) {
    const response = Buffer.from(result.Payload).toString("utf8");

    res.status(200).json(JSON.parse(response));
    return;
  }

  res.status(200).json({ type: "error", message: "Could not parse payload" });
}
