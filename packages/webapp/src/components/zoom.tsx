import { FloatButton } from "antd";
import React from "react";
import { useSetRecoilState } from "recoil";

import { zoomAtom } from "@/state/zoom";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

export const Zoom: React.FC = () => {
  const setZoom = useSetRecoilState(zoomAtom);

  return (
    <>
      <FloatButton.Group shape="square" style={{ right: 35, bottom: 35 }}>
        <FloatButton
          icon={<PlusOutlined />}
          onClick={() => setZoom((pre) => pre + 0.1)}
        />
        <FloatButton
          icon={<MinusOutlined />}
          onClick={() => setZoom((pre) => pre - 0.1)}
        />
      </FloatButton.Group>
    </>
  );
};
