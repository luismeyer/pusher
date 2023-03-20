import { callRunner } from "@/api/callRunner";
import { validateFlow } from "@/api/validateFlow";
import { Flow } from "@pusher/shared";
import { NextResponse } from "next/server";

export const config = {
  // needs to be edge because the request take longer
  // than 10s (the max timeout for vercel function)
  runtime: "edge",
  regions: ["fra1"],
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const flow = searchParams.get("flow");

  if (!flow) {
    return NextResponse.json(
      { type: "error", message: "Missing flow" },
      { status: 200 }
    );
  }

  let flowPayload: Flow;

  try {
    const decodedFlow = decodeURIComponent(flow);

    flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(
        { type: "error", message: e.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { type: "error", message: "Flow parsing error" },
      { status: 404 }
    );
  }

  const result = await callRunner(flowPayload);

  if (result.Payload) {
    const response = Buffer.from(result.Payload).toString("utf8");

    return NextResponse.json(JSON.parse(response), { status: 200 });
  }

  return NextResponse.json(
    { type: "error", message: "Could not parse payload" },
    { status: 200 }
  );
}
