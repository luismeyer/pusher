import { Page } from "puppeteer";
import { click } from "./click";
import { Action, isDecisionAction, isNavigationAction } from "./db";
import { openPage } from "./openPage";
import { scrollPageToBottom } from "./scrollPageToBottom";
import { type } from "./type";
import { timeout } from "./timeout";
import { waitFor } from "./waitFor";
import { exists } from "./exists";
import { textContentMatches } from "./textContentMatches";
import { sendTelegramMessage } from "./sendTelegramMessage";

export const executeActions = async (
  page: Page,
  action: Action
): Promise<boolean> => {
  let decision = undefined;

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
    return executeActions(page, action.trueNextAction);
  }

  if (!decision && isDecisionAction(action) && action.falseNextAction) {
    return executeActions(page, action.falseNextAction);
  }

  if (isNavigationAction(action) && action.nextAction) {
    return executeActions(page, action.nextAction);
  }

  return true;
};
