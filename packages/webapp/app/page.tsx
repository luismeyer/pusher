import { Space } from "antd";

import { Footer } from "@/components/footer";
import { HowItWorks } from "@/components/howItWorks";
import { Stage } from "@/components/stage";

export default function Home() {
  return (
    <main>
      <Space direction="vertical" size={128}>
        <Stage />

        <HowItWorks />

        <Footer />
      </Space>
    </main>
  );
}
