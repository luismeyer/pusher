import Head from "next/head";

import { AuthModal } from "@/components/authModal";
import { Console } from "@/components/console";

export default function ConsolePage() {
  return (
    <>
      <Head>
        <title>PHR Console</title>
        <meta name="description" content="Pusher App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <AuthModal />

        <Console />
      </main>
    </>
  );
}
