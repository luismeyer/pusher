"use client";

import { ImportExport } from "./importExport";
import { LoadFlow } from "./loadFlow";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";

type LoadFlowModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  defaultId: string;
};

export const LoadFlowDrawer: React.FC<LoadFlowModalProps> = ({
  defaultId,
  open,
  setOpen,
}) => {
  return (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerContent className="h-4/5 flex flex-col">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">
            Load, Import or Export a Flow
          </DrawerTitle>
        </DrawerHeader>

        <div className="grid p-4 gap-8 grid-cols-2 overflow-auto">
          <LoadFlow defaultId={defaultId} setOpen={setOpen} />

          <ImportExport setOpen={setOpen} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
