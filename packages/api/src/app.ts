import cors from "cors";
import express from "express";

import { auth } from "./auth";
import { debugHandler } from "./debugHandler";
import { loadHandler } from "./loadHandler";
import { submitHandler } from "./submitHandler";
import { tokenHandler } from "./tokenHandler";

export const app = express();

app.use(cors());

app.get("/debug", auth, debugHandler);
app.get("/submit", auth, submitHandler);
app.get("/load", auth, loadHandler);
app.get("/token", auth, tokenHandler);

app.get("/", (_req, res) => {
  res.send("Hello Pusher Api!");
});
