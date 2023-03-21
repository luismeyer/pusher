import { Button, Input, InputNumber, Radio, Switch } from "antd";
import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";
import styles from "@/styles/topbar.module.css";

import { DebugModal } from "./debugModal";
import { SubmitModal } from "./submitModal";
import { LoadFlowModal } from "./loadFlowModel";

export const TopBar: React.FC = () => {
  const [flowData, setFlowData] = useRecoilState(flowAtom);

  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isLoadFlowOpen, setIsLoadFlowOpen] = useState(false);

  const failsStatus = useMemo((): "error" | "warning" | undefined => {
    if (flowData.fails >= 3) {
      return "error";
    }

    if (flowData.fails > 0) {
      return "warning";
    }
  }, [flowData.fails]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={`${styles.item} ${styles.itemName}`}>
            <span>Flow Name</span>
            <Input
              placeholder="Name"
              value={flowData.name}
              onChange={(e) =>
                setFlowData((pre) => ({ ...pre, name: e.target.value }))
              }
            />
          </div>

          <div className={`${styles.item} ${styles.itemFails}`}>
            <span>Fails</span>
            <InputNumber
              value={flowData.fails}
              status={failsStatus}
              onChange={(update) =>
                setFlowData((pre) => ({ ...pre, fails: update ?? 0 }))
              }
            />
          </div>

          <div className={`${styles.item} ${styles.itemInterval}`}>
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

          <div>
            <Button
              type="default"
              block
              onClick={() => setIsLoadFlowOpen(true)}
            >
              Load Flow
            </Button>
          </div>

          <div className={styles.itemExec}>
            <Button type="default" block>
              Flow executions
            </Button>
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

      <LoadFlowModal
        defaultId={flowData.id}
        open={isLoadFlowOpen}
        setOpen={setIsLoadFlowOpen}
      />

      <DebugModal open={isDebugOpen} setOpen={setIsDebugOpen} />

      <SubmitModal open={isSubmitOpen} setOpen={setIsSubmitOpen} />
    </>
  );
};
