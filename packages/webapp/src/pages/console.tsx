import Head from "next/head";

import { AuthModal } from "@/components/authModal";
import { Console } from "@/components/console";
import { getAll, get } from "@vercel/edge-config";
import { GetServerSideProps } from "next";
import { FeatureFlags, FeatureFlagsContext } from "../utils/featureFlags";

export const getServerSideProps: GetServerSideProps<
  FeatureFlags
> = async () => {
  return {
    props: await getAll<FeatureFlags>(),
  };
};

export default function ConsolePage(props: FeatureFlags) {
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

        <FeatureFlagsContext.Provider value={props}>
          <Console />
        </FeatureFlagsContext.Provider>
      </main>
    </>
  );
}
