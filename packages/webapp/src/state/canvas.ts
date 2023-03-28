import { atom } from "recoil";

export const canvasAtom = atom({
  key: "Canvas",
  default: {
    width: 0,
    height: 0,
    offSetX: 0,
    offSetY: 0,
  },
});
