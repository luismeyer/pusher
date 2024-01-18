"use client";

import { Github } from "lucide-react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <div className="flex w-full items-center justify-center p-8 bg-gray-100">
      <Link
        className="flex gap-2"
        target="_blank"
        href="https://github.com/luismeyer/pusher"
      >
        <Github />
        Repository
      </Link>
    </div>
  );
};
