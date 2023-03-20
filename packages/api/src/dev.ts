import { app } from "./app";

const { API_URL } = process.env;
if (!API_URL) {
  throw new Error("Environment Var API_URL is not set");
}

const { port } = new URL(API_URL);

app.listen(port, () => {
  console.info(`Api listening on ${API_URL}`);
});
