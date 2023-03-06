import { Page } from "puppeteer";
import { hasNoAppointments } from "./hasAppointments";
import { navigateToAppointments } from "./navigateToAppointments";
import { sendTelegramMessage } from "./sendTelegramMessage";

export type CheckOptions = {
  page: Page;
  centerName: string;
  accordionNumber: number;
  serviceNumber: number;
};

const chatId = process.env.TELEGRAM_CHAT_ID;

export const checkCenter = async (options: CheckOptions) => {
  try {
    const { page, centerName } = options;

    await navigateToAppointments(options);

    const noAppointments = await hasNoAppointments(page);

    if (noAppointments) {
      return;
    }

    await sendTelegramMessage(
      "876296520",
      `Neue Termine in ${centerName} schnell schnell: https://termin.bremen.de/termine`
    );
  } catch (error) {
    await sendTelegramMessage(
      "876296520",
      "Ein Fehler ist aufgetreten: " + error
    );
  }
};
