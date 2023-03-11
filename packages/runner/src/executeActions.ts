import { Page } from "puppeteer-core";

import {
  Action,
  isDecisionAction,
  isNavigationAction,
  isSelectorAction,
} from "@pusher/shared";

import { click } from "./click";
import { exists } from "./exists";
import { openPage } from "./openPage";
import { scrollPageToBottom } from "./scrollPageToBottom";
import { sendTelegramMessage } from "./sendTelegramMessage";
import { textContentMatches } from "./textContentMatches";
import { timeout } from "./timeout";
import { type } from "./type";
import { waitFor } from "./waitFor";

const createSelector = (
  action: Action,
  variables?: Record<string, string>
): string => {
  if (!variables || !isSelectorAction(action)) {
    return "";
  }

  // find {{variableName}} in the selector
  const [_match, variableName] = action.selector.match(/{{(.*)}}/) ?? [];

  if (!variableName) {
    return action.selector;
  }

  const override = variables[variableName];

  if (!override) {
    throw new Error("Missing variable: " + variableName);
  }

  return action.selector.replace(`{{${variableName}}}`, override);
};

export const executeActions = async (
  page: Page,
  action: Action,
  variables?: Record<string, string>
): Promise<boolean> => {
  let decision = undefined;

  const selector = createSelector(action, variables);

  switch (action.type) {
    case "openPage":
      await openPage(page, action.pageUrl);
      break;

    case "type":
      await type(page, selector, action.text);
      break;

    case "click":
      await click(page, selector);
      break;

    case "scrollToBottom":
      await scrollPageToBottom(page);
      break;

    case "waitFor":
      await waitFor(page, selector);
      break;

    case "timeout":
      await timeout(action.timeInSeconds);
      break;

    case "exists":
      decision = await exists(page, selector);
      break;

    case "textContentMatches":
      decision = await textContentMatches(
        page,
        action.selector,
        action.textContent
      );
      break;

    case "telegram":
      await sendTelegramMessage(action.chatId, action.message);
      break;
  }

  if (decision && isDecisionAction(action) && action.trueNextAction) {
    return executeActions(page, action.trueNextAction, variables);
  }

  if (!decision && isDecisionAction(action) && action.falseNextAction) {
    return executeActions(page, action.falseNextAction, variables);
  }

  if (isNavigationAction(action) && action.nextAction) {
    return executeActions(page, action.nextAction, variables);
  }

  return true;
};
