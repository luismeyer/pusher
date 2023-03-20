import { useResetRecoilState } from "recoil";

import { dataAtom } from "@/state/data";
import { positionAtom } from "@/state/position";
import { relationAtom } from "@/state/relation";
import { sizeAtom } from "@/state/size";
import { useEffect } from "react";

export const useActionCleanup = (id: string) => {
  const resetSize = useResetRecoilState(sizeAtom(id));
  const resetPosition = useResetRecoilState(positionAtom(id));
  const resetRelation = useResetRecoilState(relationAtom(id));

  const resetData = useResetRecoilState(dataAtom(id));

  useEffect(() => {
    // do nothing on mount

    return () => {
      // clean up on unmount

      resetSize();
      resetPosition();
      resetRelation();
      resetData();
    };
  }, [id, resetData, resetPosition, resetRelation, resetSize]);
};
