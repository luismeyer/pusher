"use client";

import Link from "next/link";

import { GithubOutlined } from "@ant-design/icons";

export const Footer: React.FC = () => {
  return (
    <div className="flex w-full items-center justify-center p-8 bg-gray-100">
      <Link
        className="flex gap-2"
        target="_blank"
        href="https://github.com/luismeyer/pusher"
      >
        <GithubOutlined />
        Repository
      </Link>
    </div>
  );
};
