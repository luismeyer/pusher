"use client";

import React, { useCallback, useState } from "react";
import { useRecoilState } from "recoil";

import { authOpenAtom } from "@/state/auth";

import { clearToken, storeToken } from "../utils/auth";
import { tokenAction } from "@/app/api/token.action";
import { useActionCall } from "@/hooks/useActionCall";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const AuthModal: React.FC = () => {
  const [open, setOpen] = useRecoilState(authOpenAtom);

  const [token, setToken] = useState<string | undefined>();

  const isValidToken = useActionCall(tokenAction);

  const testToken = useCallback(async () => {
    if (!token) {
      return;
    }

    storeToken(token);

    const valid = await isValidToken();

    if (!valid) {
      toast.error("Wrong Token", {});

      clearToken();
      setToken("");

      return;
    }

    setOpen(!valid);
  }, [isValidToken, setOpen, token]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => setOpen(newOpen)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Not authorized</DialogTitle>

          <DialogDescription>
            Because Pusher is still under development the Api is only available
            for certain users. You can still use the Webapp though.
          </DialogDescription>
        </DialogHeader>

        <Input
          placeholder="pusher api token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          type="password"
        />

        <DialogFooter>
          <Button type="button" onClick={testToken}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
