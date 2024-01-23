import { atomFamily } from "recoil";

type SizeAndPosition = {
  width: number;
  height: number;
};

export const sizeAtom = atomFamily<SizeAndPosition, string>({
  key: "Size",
  effects: [],
  default: {
    width: 400,
    height: 200,
  },
});
