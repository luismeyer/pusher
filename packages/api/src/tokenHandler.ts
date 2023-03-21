import { RequestHandler } from "express";

export const tokenHandler: RequestHandler = async (_req, res) => {
  res.status(200).json({ type: "success", message: "Token is valid" });
};
