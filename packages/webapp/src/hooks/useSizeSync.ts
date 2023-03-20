import { RefObject, useEffect } from "react";
import { useRecoilState } from "recoil";
import { sizeAtom } from "../state/size";

export const useSizeSync = (id: string, ref: RefObject<HTMLElement>) => {
  const [size, setSize] = useRecoilState(sizeAtom(id));

  // saves the element height in the atom
  useEffect(() => {
    if (size.height !== ref.current?.clientHeight) {
      setSize((pre) => ({ ...pre, height: ref.current?.clientHeight ?? 0 }));
    }

    if (size.width !== ref.current?.clientWidth) {
      setSize((pre) => ({ ...pre, width: ref.current?.clientWidth ?? 0 }));
    }
  }, [ref, setSize, size.height, size.width]);
};
