"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "./ui/button";

export const LoginButton = () => {
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);

    await signIn("github");
  }

  return (
    <Button disabled={loading} onClick={login} className="gap-2">
      <span>Sign in with Github</span>
    </Button>
  );
};
