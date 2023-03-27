import { DeleteObjectCommand } from "@aws-sdk/client-s3";

import { bucketName } from "./bucketName";
import { s3Client } from "./s3Client";

export const deleteAsset = (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return s3Client.send(command);
};
