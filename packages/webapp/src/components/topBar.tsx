import { Button, Input, InputNumber, Radio, Segmented, Switch } from "antd";
import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";
import styles from "@/styles/topbar.module.css";
import { isInterval } from "@pusher/shared";

import { DebugModal } from "./debugModal";
import { ExecutionsDrawer } from "./executionsDrawer";
import { LoadFlowModal } from "./loadFlowModel";
import { SubmitModal } from "./submitModal";

export const TopBar: React.FC = () => {
  const [flowData, setFlowData] = useRecoilState(flowAtom);

  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isLoadFlowOpen, setIsLoadFlowOpen] = useState(false);
  const [isExecutionsOpen, setIsExecutionsOpen] = useState(false);

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
            <span>Name</span>
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
            <Segmented
              options={["6h", "12h"]}
              value={flowData.interval}
              onChange={(e) => {
                const value = e.toString();

                if (isInterval(value)) {
                  setFlowData((pre) => ({ ...pre, interval: value }));
                }
              }}
            />
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
            <Button
              type="default"
              block
              onClick={() => setIsExecutionsOpen(true)}
            >
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

      <ExecutionsDrawer open={isExecutionsOpen} setOpen={setIsExecutionsOpen} />
    </>
  );
};
