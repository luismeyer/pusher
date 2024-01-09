"use client";

import { Badge } from "antd";
import Title from "antd/lib/typography/Title";
import Image from "next/image";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button } from "./ui/button";

const Texts = [
  "google.com",
  "your dentists homepage",
  "every Website there is!",
];

export const Stage: React.FC = () => {
  const [text, setText] = useState("");

  const [restText, setRestText] = useState("");

  const pointerIndex = useRef(0);

  const [cursor, setCursor] = useState(true);

  const updateText = (text: string, index: number) => {
    const letters = text.slice(0, index);

    const rest = text
      .slice(index)
      .split("")
      .map(() => "\u00A0")
      .join("");

    setText(letters);
    setRestText(rest);
  };

  const deleteText = useCallback(
    (text: string) =>
      new Promise((res) => {
        const id = setInterval(() => {
          if (pointerIndex.current === 0) {
            clearInterval(id);
            res(true);

            return;
          }

          pointerIndex.current = pointerIndex.current - 1;

          updateText(text, pointerIndex.current);
        }, 50);
      }),
    []
  );

  const createText = useCallback(
    (text: string) =>
      new Promise((res) => {
        const id = setInterval(async () => {
          const random = Math.floor(Math.random() * 10);
          if (random === 0) {
            return;
          }

          if (pointerIndex.current > text.length) {
            clearInterval(id);
            res(true);

            return;
          }

          pointerIndex.current = pointerIndex.current + 1;

          updateText(text, pointerIndex.current);
        }, 75);
      }),
    []
  );

  const renderPointer = () => {
    const id = setInterval(() => {
      setCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(id);
      setCursor(false);
    };
  };

  const renderTexts = useCallback(async () => {
    const clearPointer = renderPointer();

    for (let index = 0; index < Texts.length; index++) {
      const text = Texts[index];

      await createText(text);

      if (index === Texts.length - 1) {
        clearPointer();
      }

      await new Promise((res) => setTimeout(res, 1000));

      if (index !== Texts.length - 1) {
        await deleteText(text);
      }
    }
  }, [createText, deleteText]);

  useEffect(() => {
    renderTexts();
  }, [renderTexts]);

  const tiltAngle = 3;

  const title = useMemo(() => `Create Push Notifications for ${text}`, [text]);

  const height = "95vh";

  return (
    <>
      <div
        style={{
          width: "100vw",
          height,
          background: "linear-gradient(200deg, #0b3b74, #072448)",
          position: "absolute",
          transform: `skewY(${tiltAngle}deg)`,
          top: `calc(50vw * tan(${tiltAngle}deg) * -1)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Badge count={100}>
          <h1 style={{ color: "white" }}>Pusher</h1>
        </Badge>
      </div>

      <div
        style={{
          height,
          padding: "0 0 10vh 10vw",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            justifyItems: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div>
            <Title
              level={1}
              style={{
                color: "white",
                fontSize: "3.5vw",
              }}
            >
              {title}
              {cursor && "|"}
              {restText}
            </Title>

            <Button asChild>
              <Link href="/console">Open Console</Link>
            </Button>
          </div>

          <Image
            style={{ maxWidth: "25vw", objectFit: "contain", height: "auto" }}
            src="/bell.png"
            alt="Mock image"
            width={500}
            height={500}
            priority
          />
        </div>
      </div>
    </>
  );
};
