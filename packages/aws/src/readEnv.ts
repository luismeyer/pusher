const bucketName = process.env.BUCKET_NAME;
if (!bucketName) {
  throw new Error("BUCKET_NAME Env variable is not set");
}

const tableName = process.env.TABLE_NAME;
if (!tableName) {
  throw new Error("TABLE_NAME Env variable is not set");
}

const runnerFunctionName = process.env.RUNNER_FUNCTION_NAME;
if (!runnerFunctionName) {
  throw new Error("RUNNER_FUNCTION_NAME Env variable is not set");
}

const telegramToken = process.env.TELEGRAM_TOKEN;
if (!telegramToken) {
  throw new Error("TELEGRAM_TOKEN Env variable is not set");
}

const resendToken = process.env.RESEND_TOKEN;
if (!resendToken) {
  throw new Error("RESEND_TOKEN Env variable is not set");
}

const intervalIndexName = process.env.INTERVAL_INDEX_NAME;
if (!intervalIndexName) {
  throw new Error("INTERVAL_INDEX_NAME Env variable is not set");
}

const userIndexName = process.env.USER_INDEX_NAME;
if (!userIndexName) {
  throw new Error("USER_INDEX_NAME Env variable is not set");
}

const { WEBSOCKET_APP_ID, NEXT_PUBLIC_WEBSOCKET_KEY, WEBSOCKET_SECRET } =
  process.env;

if (!WEBSOCKET_APP_ID || !NEXT_PUBLIC_WEBSOCKET_KEY || !WEBSOCKET_SECRET) {
  throw new Error("Missing websocket environment variables");
}

export const Environment = {
  bucketName,
  tableName,
  runnerFunctionName,
  telegramToken,
  resendToken,
  intervalIndexName,
  userIndexName,
  webSocketAppId: WEBSOCKET_APP_ID,
  webSocketKey: NEXT_PUBLIC_WEBSOCKET_KEY,
  webSocketSecret: WEBSOCKET_SECRET,
};
