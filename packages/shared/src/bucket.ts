export const createBucketUrl = (bucketName: string, key: string) => {
  const region = process.env.REGION ?? "eu-central-1";

  let url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

  if (process.env.IS_LOCAL) {
    url = `http://localhost:3001/${bucketName}/${key}`;
  }

  return url;
};
