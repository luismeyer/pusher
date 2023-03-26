import React from "react";
import { Steps, Timeline, Typography } from "antd";

export const HowItWorks: React.FC = () => {
  const DotStyle = { fontSize: "24px" };

  return (
    <div
      style={{
        display: "grid",
        justifyItems: "center",
        gap: 50,
        maxWidth: "50vw",
        margin: "0 auto",
      }}
    >
      <Typography.Title style={{ fontSize: 50, textAlign: "center" }} level={2}>
        How it works:
      </Typography.Title>

      <Steps
        direction="vertical"
        current={5}
        items={[
          {
            icon: <span style={DotStyle}>🔨</span>,
            title: (
              <Typography.Title level={3}>Configure your Flow</Typography.Title>
            ),
            description: (
              <p>
                Use the Top Navigation to configure your Flows Name, Interval,
                Fails and Executions. Pick a <b>Name</b> to identify the Flow,
                it will not be visible to other people.
                <br /> The <b>Interval</b> is the time between two executions of
                the Flow. Currently you can choose between 6 Hours and 12 Hours.
                <br /> <b>Fails</b> displays the amount how oftern the Flow
                failed in the cloud. The Flow will no longer be executed after 3
                Fails. Make sure to reset this value after you fixed a failing
                Flow.
                <br /> With <b>Executions</b> you can run your Flow multiple
                Times with dynamic Data. Inside the Menu you can create
                Executions and build Variables that can then be placed inside
                the Actions.
              </p>
            ),
          },
          {
            icon: <span style={DotStyle}>🎬</span>,
            title: (
              <Typography.Title level={3}>
                Add the Actions you need
              </Typography.Title>
            ),
            description: (
              <p>
                From the SideBar you can pick Actions to build your Flow.{" "}
                <b>Actions</b> are the Building Blocks to create a Decision Tree
                that will guide a headless Browser through any Website.
              </p>
            ),
          },
          {
            icon: <span style={DotStyle}>🔗</span>,
            title: (
              <Typography.Title level={3}>
                Connect the Actions and provide JS Selectors, Text Inputs and
                Output Data
              </Typography.Title>
            ),
            description: (
              <p>
                Each Action can be configured independently. Make sure any
                Selectors and Inputs you are providing are not dynamic and
                therefor dont change per Page Request. Use{" "}
                <b>{"{{ <VariableName> }}"}</b> inside any input that accepts
                text to include Variables you defined in the Executions Menu.
              </p>
            ),
          },
          {
            icon: <span style={DotStyle}>🧪</span>,
            title: (
              <Typography.Title level={3}>Test your Flow</Typography.Title>
            ),
            description: (
              <p>
                After building the Flow you can use the Test Button to send your
                Flow to the Runner Server. The Runner will execute the Flow like
                it would after you submitted it to the cloud. To help you debug
                any Errors a Screenrecording will be created. Use it to iterate
                on your Flow and make it ready for submission.
              </p>
            ),
          },
          {
            icon: <span style={DotStyle}>☁️</span>,
            title: (
              <Typography.Title level={3}>
                Submit and make it run in the cloud
              </Typography.Title>
            ),
            description: (
              <p>
                Once your done testing you Flow you can submit it to the cloud.
                Afterwards it will be executed based on the Interval you defined
                previously. Save you Flow ID so you can always come back and
                edit your Flow. If you are not done building you Flow but dont
                wanna loose the Progress, you can disable it before you
                submission to avoid fails.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
};
