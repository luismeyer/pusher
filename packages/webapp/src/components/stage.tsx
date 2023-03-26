import { Typography, Button, Badge } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

import bellImage from "../../public/bell.png";

const Texts = [
  "google.com",
  "your dentists homepage",
  "every Website there is!",
];

export const Stage: React.FC = () => {
  const [text, setText] = useState("");

  const pointerIndex = useRef(0);

  const [cursor, setCursor] = useState(true);

  const deleteText = (text: string) =>
    new Promise((res) => {
      const id = setInterval(() => {
        if (pointerIndex.current === 0) {
          clearInterval(id);
          res(true);

          return;
        }

        pointerIndex.current = pointerIndex.current - 1;

        setText(text.slice(0, pointerIndex.current));
      }, 50);
    });

  const createText = (text: string) =>
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

        setText(text.slice(0, pointerIndex.current));

        pointerIndex.current = pointerIndex.current + 1;
      }, 50);
    });

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
  }, []);

  useEffect(() => {
    renderTexts();
  }, [renderTexts]);

  const tiltAngle = 3;

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "95vh",
          background: "linear-gradient(200deg, #0b3b74, #072448)",
          position: "absolute",
          transform: `skewY(${tiltAngle}deg)`,
          top: `calc(50vw * tan(${tiltAngle}deg) * -1)`,
        }}
      />

      <div
        style={{
          height: "100vh",
          padding: "0 0 10vh 10vw",
          position: "relative",
        }}
      >
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
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            justifyItems: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div>
            <Typography.Title
              level={1}
              style={{
                color: "white",
                fontSize: "3.5vw",
              }}
            >
              Create Push Notifications for {text}
              {cursor && <span>|</span>}
            </Typography.Title>

            <Link href="./console">
              <Button type="primary">Open Console</Button>
            </Link>
          </div>

          <Image
            style={{ maxWidth: "25vw", objectFit: "contain", height: "auto" }}
            src={bellImage}
            alt="Mock image"
            priority
          />
        </div>
      </div>
    </>
  );
};
