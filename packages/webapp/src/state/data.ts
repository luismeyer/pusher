import { useCallback } from "react";
import { atom, selector, useRecoilState } from "recoil";

import { Action } from "@pusher/shared";

import { memoize } from "./memoize";

type ActionsData = Record<string, Action>;

export const actionDatasAtom = atom<ActionsData>({
  key: "DatasAtom",
  default: {},
});

export const actionDataSelector = memoize((actionId?: string) =>
  selector({
    key: `DataSelector-${actionId}`,
    get: ({ get }): Action => {
      const datas = get(actionDatasAtom);

      const data = datas[actionId ?? ""];

      if (!data) {
        throw new Error("Trying to select non existing data " + actionId);
      }

      return data;
    },
    set({ set, get }, newValue) {
      const allActions = get(actionDatasAtom);

      if (!actionId) {
        return;
      }

      set(actionDatasAtom, { ...allActions, [actionId]: newValue as Action });
    },
  })
);

export const useDataAtom = (actionId?: string) =>
  useRecoilState(actionDataSelector(actionId));

export const useDatasAtom = () => {
  const [datas, setDatas] = useRecoilState(actionDatasAtom);

  const deleteData = useCallback(
    (id: string) => {
      const { [id]: toBeDelete, ...rest } = datas;

      setDatas(rest);
    },
    [datas, setDatas]
  );

  const addData = useCallback(
    (id: string, data: Action) => {
      setDatas({
        ...datas,
        [id]: data,
      });
    },
    [datas, setDatas]
  );

  return { datas, addData, deleteData };
};
