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

const replaceVariables = (
  action: Action,
  variables?: Record<string, string | undefined>
): Action => {
  if (!variables) {
    return action;
  }

  return Object.entries(action).reduce<Action>((acc, [key, value]) => {
    const raw = { ...acc, [key]: value };

    if (typeof value !== "string") {
      return raw;
    }

    const regex = /{{(.*)}}/;

    const [_match, variableName] = value.match(regex) ?? [];

    if (!variableName) {
      return raw;
    }

    const { [variableName.trim()]: override } = variables;

    if (!override) {
      return raw;
    }

    return {
      ...acc,
      [key]: value.replace(regex, override),
    };
  }, {} as Action);
};

export const executeActions = async (
  page: Page,
  rawAction: Action,
  variables?: Record<string, string | undefined>
): Promise<boolean> => {
  let decision = undefined;

  const action = replaceVariables(rawAction, variables);

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
