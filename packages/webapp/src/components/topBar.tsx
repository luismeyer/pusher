import {
  Button,
  Input,
  InputNumber,
  Modal,
  Radio,
  Spin,
  Switch,
  theme,
} from "antd";
import { useCallback, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { actionTreeSelector } from "@/state/actions";
import { flowAtom } from "@/state/flow";
import styles from "@/styles/topbar.module.css";
import { LoadingOutlined } from "@ant-design/icons";
import { Flow } from "@pusher/shared";

export const TopBar: React.FC = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [flowData, setFlowData] = useRecoilState(flowAtom);

  const actionTree = useRecoilValue(actionTreeSelector);

  const [video, setVideo] = useState<string | undefined>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const debugFlow = useCallback(async () => {
    setVideo(undefined);
    setIsModalOpen(true);

    const flow: Flow = {
      ...flowData,
      actionTree,
    };

    const body = encodeURIComponent(JSON.stringify(flow));

    const { response } = await fetch(`/api/debug?flow=${body}`, {
      method: "POST",
    }).then((res) => res.json());

    setVideo(response);
  }, [actionTree, flowData]);

  return (
    <>
      <div className={styles.container}>
        <div>
          <h1 style={{ color: colorPrimary }} className={styles.headline}>
            Pusher Console
          </h1>

          <div className={styles.config}>
            <div className={styles.item}>
              <span>Fails</span>
              <InputNumber
                value={flowData.fails}
                onChange={(update) =>
                  setFlowData((pre) => ({ ...pre, fails: update ?? 0 }))
                }
              />
            </div>

            <div className={styles.item}>
              <span>Interval</span>
              <Radio.Group
                buttonStyle="solid"
                value={flowData.interval}
                onChange={(e) =>
                  setFlowData((pre) => ({ ...pre, interval: e.target.value }))
                }
              >
                <Radio.Button value="6h">6h</Radio.Button>
                <Radio.Button value="12h">12h</Radio.Button>
              </Radio.Group>
            </div>

            <div className={styles.item}>
              <span>Flow Name</span>
              <Input
                placeholder="Name"
                value={flowData.name}
                onChange={(e) =>
                  setFlowData((pre) => ({ ...pre, name: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Switch
            className={styles.switch}
            checkedChildren="Enabled"
            unCheckedChildren="Disabled"
            checked={!flowData.disabled}
            onChange={(update) =>
              setFlowData((pre) => ({ ...pre, disabled: !update }))
            }
          />

          <Button type="default" onClick={debugFlow}>
            Test
          </Button>

          <Button type="primary" onClick={console.log}>
            Submit
          </Button>
        </div>
      </div>

      <Modal
        title="Debug Flow"
        open={isModalOpen}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => setIsModalOpen(false)}
      >
        <Spin
          spinning={!video}
          indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        >
          <video className={styles.video} src={video} controls />
        </Spin>
      </Modal>
    </>
  );
};
