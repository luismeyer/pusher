import { BaseAction } from "./flow";

export type TelegramAction = BaseAction & {
  type: "telegram";
  message: string;
  chatId: string;
};

export type EmailAction = BaseAction & {
  type: "email";
  message: string;
  email: string;
};

export type OutputAction = TelegramAction | EmailAction;
