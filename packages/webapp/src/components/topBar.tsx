import {
  Button,
  Col,
  Input,
  InputNumber,
  Row,
  Segmented,
  Space,
  Switch,
} from "antd";
import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";
import { isInterval } from "@pusher/shared";

import { DebugModal } from "./debugModal";
import { ExecutionsDrawer } from "./executionsDrawer";
import { LoadFlowDrawer } from "./loadFlowDrawer";
import { ResetModal } from "./resetModal";
import { SubmitModal } from "./submitModal";

export const TopBar: React.FC = () => {
  const [flowData, setFlowData] = useRecoilState(flowAtom);

  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isLoadFlowOpen, setIsLoadFlowOpen] = useState(false);
  const [isExecutionsOpen, setIsExecutionsOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

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
      <div
        style={{
          color: "white",
          lineHeight: "initial",
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          alignItems: "center",
          padding: "24px 0",
        }}
      >
        <Space direction="vertical">
          <Row gutter={[8, 8]}>
            <Col>
              <p>Name</p>
              <Input
                placeholder="Name"
                value={flowData.name}
                onChange={(e) =>
                  setFlowData((pre) => ({ ...pre, name: e.target.value }))
                }
              />
            </Col>

            <Col>
              <p>Fails</p>
              <InputNumber
                value={flowData.fails}
                status={failsStatus}
                onChange={(update) =>
                  setFlowData((pre) => ({ ...pre, fails: update ?? 0 }))
                }
              />
            </Col>

            <Col>
              <p>Interval</p>
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
            </Col>
          </Row>

          <Row gutter={[8, 8]}>
            <Col span={8}>
              <Button
                type="default"
                block
                onClick={() => setIsLoadFlowOpen(true)}
              >
                Load
              </Button>
            </Col>

            <Col span={8}>
              <Button
                type="default"
                block
                onClick={() => setIsExecutionsOpen(true)}
              >
                Executions
              </Button>
            </Col>

            <Col span={8}>
              <Button
                block
                type="default"
                danger
                onClick={() => setIsResetOpen(true)}
              >
                Reset
              </Button>
            </Col>
          </Row>
        </Space>

        <div>
          <Row gutter={[8, 8]}>
            <Col span={24}>
              <Switch
                style={{ width: "100%" }}
                checkedChildren="Enabled"
                unCheckedChildren="Disabled"
                checked={!flowData.disabled}
                onChange={(update) =>
                  setFlowData((pre) => ({ ...pre, disabled: !update }))
                }
              />
            </Col>

            <Col span={12}>
              <Button block type="default" onClick={() => setIsDebugOpen(true)}>
                Test
              </Button>
            </Col>

            <Col span={12}>
              <Button
                block
                type="primary"
                onClick={() => setIsSubmitOpen(true)}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      <LoadFlowDrawer
        defaultId={flowData.id}
        open={isLoadFlowOpen}
        setOpen={setIsLoadFlowOpen}
      />

      <DebugModal open={isDebugOpen} setOpen={setIsDebugOpen} />

      <SubmitModal open={isSubmitOpen} setOpen={setIsSubmitOpen} />

      <ExecutionsDrawer open={isExecutionsOpen} setOpen={setIsExecutionsOpen} />

      <ResetModal open={isResetOpen} setOpen={setIsResetOpen} />
    </>
  );
};
