import { createLambdaServer } from "./createLambdaServer";
import { createS3Server } from "./createS3Server";

createS3Server();

createLambdaServer();
