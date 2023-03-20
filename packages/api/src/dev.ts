import { app } from "./app";

const { NEXT_PUBLIC_API_URL } = process.env;
if (!NEXT_PUBLIC_API_URL) {
  throw new Error("Environment Var API_URL is not set");
}

const { port } = new URL(NEXT_PUBLIC_API_URL);

app.listen(port, () => {
  console.info(`Api listening on ${NEXT_PUBLIC_API_URL}`);
});
