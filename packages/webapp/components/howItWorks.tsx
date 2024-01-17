"use client";

import React from "react";

const DotStyle = { fontSize: "24px" };

const Items = [
  {
    icon: <span style={DotStyle}>🔨</span>,
    title: <h3 className="text-xl">Configure your Flow</h3>,
    description: (
      <p>
        Use the Top Navigation to configure your Flows Name, Interval, Fails and
        Executions. Pick a <b>Name</b> to identify the Flow, it will not be
        visible to other people.
        <br /> The <b>Interval</b> is the time between two executions. Currently
        you can choose between 6 Hours and 12 Hours.
        <br /> <b>Fails</b> display the amount how often the Flow failed in the
        cloud. After 3 Fails it will no longer be executed. Make sure to reset
        this value after you fixed a failing Flow.
        <br /> With <b>Executions</b> you can run your Flow multiple Times
        handling dynamic Data. Inside the Menu you can create Executions and
        build Variables that can then be placed inside the Actions.
      </p>
    ),
  },
  {
    icon: <span style={DotStyle}>🎬</span>,
    title: <h3 className="text-xl">Add the Actions you need</h3>,
    description: (
      <p>
        From the SideBar you can pick Actions to build your Flow. <b>Actions</b>{" "}
        are the Building Blocks to create a Decision Tree that will guide a
        headless Browser through any Website.
      </p>
    ),
  },
  {
    icon: <span style={DotStyle}>🔗</span>,
    title: (
      <h3 className="text-xl">
        Connect the Actions and provide JS Selectors, Text Inputs and Output
        Data
      </h3>
    ),
    description: (
      <p>
        Each Action can be configured independently. Make sure any Selectors and
        Inputs you are providing are not dynamic and therefor dont change per
        Page Request. Use <b>{"{{ <VariableName> }}"}</b> inside any input that
        accepts text to include Variables you defined in the Executions Menu.
      </p>
    ),
  },
  {
    icon: <span style={DotStyle}>🧪</span>,
    title: <h3 className="text-xl">Test your Flow</h3>,
    description: (
      <p>
        After building the Flow you can use the Test Button to send your Flow to
        the Runner Server. The Runner will execute the Flow like it would after
        you submitted it to the cloud. To help you debug any Errors a
        Screenrecording will be created. Use it to iterate on your Flow and make
        it ready for submission.
      </p>
    ),
  },
  {
    icon: <span style={DotStyle}>☁️</span>,
    title: <h3 className="text-xl">Submit and run it in the cloud</h3>,
    description: (
      <p>
        Once you are done testing your Flow you can submit it to the cloud.
        Afterwards it will be executed based on the Interval you defined
        previously. Save the Flow ID so you can always come back and edit the
        Flow later. If you are not done building youre Flow but dont wanna loose
        the Progress, you can disable it before submission to avoid fails.
      </p>
    ),
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <div className="grid items-center gap-10 w-1/2 m-auto">
      <h2 className="text-center text-3xl">How it works:</h2>

      <div className="grid gap-8">
        {Items.map(({ icon, title, description }, i) => (
          <div key={i} className="grid gap-1">
            <div className="flex items-center gap-4">
              {icon}
              {title}
            </div>

            {description}
          </div>
        ))}
      </div>
    </div>
  );
};
