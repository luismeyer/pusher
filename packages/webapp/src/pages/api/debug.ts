import { NextApiHandler } from "next";

import { callRunner } from "@/api/callRunner";
import { validateFlow } from "@/api/validateFlow";
import { Flow, RunnerResult } from "@pusher/shared";

const handler: NextApiHandler<RunnerResult> = async (req, res) => {
  let { flow } = req.query;

  if (!flow) {
    res.status(404).json({ type: "error", message: "Missing flow" });
    return;
  }

  if (typeof flow !== "string") {
    return res
      .status(404)
      .json({ type: "error", message: "Wrong flow parameter" });
  }

  const decodedFlow = decodeURIComponent(flow);

  let flowPayload: Flow;

  try {
    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      res.status(404).json({ type: "error", message: e.message });
      return;
    }

    res.status(404).json({ type: "error", message: "Flow parsing error" });
    return;
  }

  const result = await callRunner(flowPayload);

  if (result.Payload) {
    const response = Buffer.from(result.Payload).toString("utf8");

    res.status(200).json(JSON.parse(response));
    return;
  }

  res.status(200).json({ type: "error", message: "Could not parse payload" });
};

export default handler;
