const { BUCKET_NAME } = process.env;

if (!BUCKET_NAME) {
  throw new Error("BUCKET_NAME is not defined");
}

export const bucketName = BUCKET_NAME;
