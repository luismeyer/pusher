if (!process.env.TELEGRAM_TOKEN) {
  throw new Error("Telegram token not set");
}

import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false });

export const sendTelegramMessage = (chatId: string, message: string) => {
  return bot.sendMessage(chatId, message);
};
