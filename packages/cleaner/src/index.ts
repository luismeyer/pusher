import { validate } from "uuid";
import { differenceInDays, subDays } from "date-fns";

import { listAssets } from "./listAssets";
import { deleteAsset } from "./deleteAsset";

export const handler = async () => {
  const assets = await listAssets();

  if (!assets?.length) {
    console.info("No assets in the Bucket");

    return true;
  }

  const assetsToDelete = assets.filter((asset) => {
    const isValidUUID = validate(asset.Key ?? "");

    const lastModified = differenceInDays(
      Date.now(),
      asset.LastModified ?? subDays(Date.now(), 100)
    );

    return isValidUUID && lastModified >= 3;
  });

  if (!assetsToDelete.length) {
    console.info("No assets to delete");

    return true;
  }

  await Promise.all(
    assetsToDelete.map((asset) => {
      console.info("Deleting:", asset.Key);

      if (!asset.Key) {
        return;
      }

      return deleteAsset(asset.Key ?? "");
    })
  );

  return true;
};
