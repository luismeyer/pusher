# Pusher 💪

Push-Notifications for everything. Ever wished a Webpage had Push-Notifications? With Pusher you can create Flows that will navigate a Browser through a Website. With a decision tree you can than create messages based on the page content and send them through a push notification channel of your choice.

The Application is available in the Cloud on [phr.vercel.app](https://phr.vercel.app) or you can clone this Repository and host it in you own AWS.

## Development

1. Make sure [direnv](https://direnv.net/) is installed
2. Create a .envrc file based on the .envrc.example file

```sh
npm install
npm run setup
npm run dev
```

This will start:

- Next Webapp on <http://localhost:3000>
- Lambda Invocation Server on <http://localhost:3002>
- Lambda HTTP Proxy Endpoint on <http://localhost:3004>
- S3 Server on <http://localhost:3001>
- DynamoDB Server on <http://localhost:3003>

## Deployment

Build the App first with `npm run build` and

Deploy the AWS Stack:

```sh
lerna run deploy --scope=@pusher/aws
```

Deploy the Webapp to Vercel:

```sh
vercel deploy --prod
```

## Infrastructure

The main parts of the Pusher App are the Runner and the Scheduler AWS Lambda Functions. If you want to host your own Pusher Instance you just need these two Functions. The Scheduler runs on a cron schedule that is defined during the deployment. It reads all Flows out of a DynamoDB Database and Filters the Flows that are not runnable. The Scheduler then invokes the Runner Function providing the Flow as the Payload. The Runner Function executes the Flow by spinning up a Headless Browser and traveling the actionTree.

For the User convinience this Repository also contains an API Lambda Function that exposes Endpoints to interact with the DynamoDB Database and a Webapp that provides a UI to build a Flow JSON Structure and request the API.

Finally this Repository contains a Cleaner Lambda Function that runs once a day to delete old Assets out of the S3 Bucket.
