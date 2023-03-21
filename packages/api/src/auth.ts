import { RequestHandler } from "express";

const { PUSHER_AUTH_TOKEN } = process.env;
if (!PUSHER_AUTH_TOKEN) {
}

export const auth: RequestHandler = ({ headers }, res, next) => {
  const token = headers.Authorization ?? headers.authorization;

  const isTokenValid = PUSHER_AUTH_TOKEN === token;

  if (!isTokenValid) {
    return res.status(401).send();
  }

  next();
};
