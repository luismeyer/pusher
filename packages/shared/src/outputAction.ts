import { BaseAction } from "./flow";

export type TelegramAction = BaseAction & {
  type: "telegram";
  message: string;
  chatId: string;
};

export type OutputAction = TelegramAction;
