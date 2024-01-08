import { Page } from "puppeteer-core";

import { Action, isDecisionAction, isNavigationAction } from "@pusher/shared";

import { click } from "./click";
import { exists } from "./exists";
import { openPage } from "./openPage";
import { scrollPageToBottom } from "./scrollPageToBottom";
import { sendTelegramMessage } from "./sendTelegramMessage";
import { textContent } from "./textContent";
import { textContentMatches } from "./textContentMatches";
import { timeout } from "./timeout";
import { type } from "./type";
import { waitFor } from "./waitFor";
import { keyboard } from "./keyboard";

const replaceVariables = (
  action: Action,
  variables?: Record<string, string | undefined>
): Action => {
  if (!variables) {
    return action;
  }

  return Object.entries(action).reduce<Action>((acc, [key, value]) => {
    if (typeof value !== "string") {
      return { ...acc, [key]: value };
    }

    // all fields that allow strings can contain variables
    let stringInputs = value;

    const regex = /{{[\w|\s]*}}/g;

    const matches = stringInputs.match(regex) ?? [];

    matches.forEach((match) => {
      const variableName = match.replace("{{", "").replace("}}", "").trim();

      if (!variableName) {
        return;
      }

      // read override from variables
      const { [variableName]: override } = variables;

      if (!override) {
        return;
      }

      stringInputs = stringInputs.replace(match, override);
    });

    return { ...acc, [key]: stringInputs };
  }, {} as Action);
};

export const executeActions = async (
  page: Page,
  rawAction: Action,
  variables?: Record<string, string | undefined>
): Promise<boolean> => {
  let decision = undefined;

  const action = replaceVariables(rawAction, variables);
  console.info("Executing action: ", action);

  let newVariables = variables ?? {};

  switch (action.type) {
    case "openPage":
      await openPage(page, action.pageUrl);
      break;

    case "type":
      await type(page, action.selector, action.text);
      break;

    case "click":
      await click(page, action.selector);
      break;

    case "scrollToBottom":
      await scrollPageToBottom(page);
      break;

    case "waitFor":
      await waitFor(page, action.selector);
      break;

    case "timeout":
      await timeout(action.timeInSeconds);
      break;

    case "exists":
      decision = await exists(page, action.selector);
      break;

    case "textContentMatches":
      decision = await textContentMatches(page, action.selector, action.text);
      break;

    case "telegram":
      await sendTelegramMessage(action.chatId, action.message);
      break;

    case "storeTextContent":
      const value = await textContent(page, action.selector);
      newVariables = {
        ...variables,
        [action.variableName]: value,
      };
      break;

    case "keyboard":
      await keyboard(page, action.key);
      break;

    default:
      throw new Error(`Unknown action type: ${action}`);
  }

  if (decision && isDecisionAction(action) && action.trueNextAction) {
    return executeActions(page, action.trueNextAction, newVariables);
  }

  if (!decision && isDecisionAction(action) && action.falseNextAction) {
    return executeActions(page, action.falseNextAction, newVariables);
  }

  if (isNavigationAction(action) && action.nextAction) {
    return executeActions(page, action.nextAction, newVariables);
  }

  return true;
};
