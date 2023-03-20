import { RequestHandler } from "express";

import { LoadResponse } from "@pusher/shared";

import { getFlow } from "./flowDB";

export const loadHandler: RequestHandler<LoadResponse> = async (req, res) => {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res
      .status(404)
      .json({ type: "error", message: "Wrong id parameter" });
  }

  const flow = await getFlow(id);

  if (!flow) {
    return res.status(404).json({ type: "error", message: "Flow not found" });
  }

  return res.status(200).json({ type: "success", flow });
};
