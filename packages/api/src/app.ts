import express from "express";
import cors from "cors";

import { debugHandler } from "./debugHandler";
import { loadHandler } from "./loadHandler";
import { submitHandler } from "./submitHandler";

export const app = express();

app.use(cors());

app.get("/debug", debugHandler);
app.get("/submit", submitHandler);
app.get("/load", loadHandler);

app.get("/", (_req, res) => {
  res.send("Hello Pusher Api!");
});
