import type { NextApiRequest, NextApiResponse } from "next";
import type {} from "aws-lambda";
import { callRunner } from "@/api/callRunner";
import { Flow } from "@pusher/shared";

interface Request extends NextApiRequest {
  query: {
    flow?: string;
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  let { flow } = req.query;

  console.log(flow);

  if (!flow) {
    res.status(404).json({ message: "Missing flow" });
    return;
  }

  const decodedFlow = decodeURIComponent(flow);

  let flowPayload: Flow;

  try {
    flowPayload = JSON.parse(decodedFlow);
  } catch (e) {
    res.status(404).json({ message: "Flow is not json" });
    return;
  }

  if (typeof flowPayload !== "object") {
    res.status(404).json({ message: "Flow is not an object" });
    return;
  }

  const result = await callRunner(flowPayload);

  console.log(result);

  if (result.Payload) {
    const response = Buffer.from(result.Payload).toString("utf8");

    console.log(response);

    res.status(200).json({ response: JSON.parse(response) });
    return;
  }

  res.status(200).json({ message: "ok" });
}
