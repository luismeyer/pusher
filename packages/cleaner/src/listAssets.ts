import { ListObjectsCommand } from "@aws-sdk/client-s3";

import { bucketName } from "./bucketName";
import { s3Client } from "./s3Client";

export const listAssets = () => {
  const command = new ListObjectsCommand({
    Bucket: bucketName,
  });

  return s3Client.send(command).then((data) => data.Contents);
};
