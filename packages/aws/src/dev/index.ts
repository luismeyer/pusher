import { createDDBServer } from "./createDDBServer";
import { createLambdaServer } from "./createLambdaServer";
import { createS3Server } from "./createS3Server";

const main = async () => {
  const stopS3 = await createS3Server();

  const stopLambda = await createLambdaServer();

  const stopDDB = await createDDBServer();

  let isExiting = false;

  const handleExit = async () => {
    if (isExiting) {
      return;
    }

    isExiting = true;

    console.info("stopping dev servers...");

    await stopS3();
    stopLambda();
    stopDDB();

    process.exit(0);
  };

  //catches ctrl+c event
  process.on("SIGINT", handleExit);

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", handleExit);
  process.on("SIGUSR2", handleExit);
};

main();
