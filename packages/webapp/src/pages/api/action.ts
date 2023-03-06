import type { NextApiRequest, NextApiResponse } from "next";
import type {} from "aws-lambda";

type Payload = {
  flowId?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: "John Doe" });
}
