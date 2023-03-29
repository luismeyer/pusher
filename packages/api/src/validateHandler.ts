import { RequestHandler } from "express";

import { ValidateResponse } from "@pusher/shared";

import { validateFlow } from "./validateFlow";

export const validateHandler: RequestHandler<
  unknown,
  ValidateResponse
> = async (req, res) => {
  const { flow } = req.query;

  if (typeof flow !== "string") {
    return res.status(404).json({ isValid: false });
  }

  try {
    const decodedFlow = decodeURIComponent(flow);

    const flowPayload = JSON.parse(decodedFlow);

    validateFlow(flowPayload);

    return res.status(200).json({ isValid: true });
  } catch (e) {
    if (e instanceof Error) {
      return res.status(404).json({ isValid: false, error: e.message });
    }

    return res.status(404).json({ isValid: false, error: "Invalid Flow" });
  }
};
