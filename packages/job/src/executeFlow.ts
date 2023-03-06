import { Page } from "puppeteer";
import { Flow } from "./db";
import { executeActions } from "./executeActions";

export const executeFlow = async (page: Page, flow: Flow) => {
  console.info("Executing flow: ", flow.id);

  return await executeActions(page, flow.actions);
};
