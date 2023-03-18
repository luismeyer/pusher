import {
  atomFamily,
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";

import { Action } from "@pusher/shared";

import { localStorageEffect } from "./localStorage";

export const dataAtom = atomFamily<Action, string>({
  key: "Data",
  effects: [localStorageEffect],
  default: {
    id: "123",
    type: "click",
    selector: "",
  },
});

const allDataAtom = selectorFamily<Action[], string[]>({
  key: "AllData",
  get:
    (ids: string[]) =>
    ({ get }) => {
      return ids
        .map((id) => get(dataAtom(id)))
        .filter((data): data is Action => Boolean(data));
    },
});

export const useDataAtom = (actionId: string) =>
  useRecoilState(dataAtom(actionId));

export const useDeleteData = (actionId: string) => {
  return useResetRecoilState(dataAtom(actionId));
};

export const useAllDataAtom = (...ids: string[]) => {
  return useRecoilValue(allDataAtom(ids));
};
