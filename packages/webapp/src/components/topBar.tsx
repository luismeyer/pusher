import { Menu } from "antd";
import { useEffect } from "react";

import { useDatasAtom } from "@/state/data";

export const TopBar: React.FC = () => {
  const { datas } = useDatasAtom();

  console.log(datas);
  useEffect(() => {}, []);

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      items={[{ type: "group", label: <h1>Pusher Console</h1> }]}
    />
  );
};
