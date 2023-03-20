import { Button, Input, InputNumber, Radio, Switch, theme } from "antd";
import { useState } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";
import styles from "@/styles/topbar.module.css";

import { DebugModal } from "./debugModal";
import { SubmitModal } from "./submitModal";

export const TopBar: React.FC = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const [flowData, setFlowData] = useRecoilState(flowAtom);

  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

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

          <Button type="default" onClick={() => setIsDebugOpen(true)}>
            Test
          </Button>

          <Button type="primary" onClick={() => setIsSubmitOpen(true)}>
            Submit
          </Button>
        </div>
      </div>

      <DebugModal open={isDebugOpen} setOpen={setIsDebugOpen} />

      <SubmitModal open={isSubmitOpen} setOpen={setIsSubmitOpen} />
    </>
  );
};
