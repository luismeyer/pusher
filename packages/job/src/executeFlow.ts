import { Page } from "puppeteer-core";
import { Flow } from "./db";
import { executeActions } from "./executeActions";

export const executeFlow = async (page: Page, flow: Flow) => {
  console.info("Executing flow: ", flow.id);

  if (flow.executions?.length) {
    console.info("Running in execution mode");

    for (const execution of flow.executions) {
      console.info("Running execution: ", execution.name);

      await executeActions(page, flow.actionTree, execution.variables);
    }

    return;
  }

  return await executeActions(page, flow.actionTree);
};
