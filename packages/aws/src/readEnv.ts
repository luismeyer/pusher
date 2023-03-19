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

export const Environment = {
  bucketName,
  tableName,
  runnerFunctionName,
  telegramToken,
};
