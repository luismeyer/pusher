import { Footer } from "@/components/footer";
import { HowItWorks } from "@/components/howItWorks";
import { Stage } from "@/components/stage";

export default function Home() {
  return (
    <main className="grid gap-40">
      <Stage />

      <HowItWorks />

      <Footer />
    </main>
  );
}
