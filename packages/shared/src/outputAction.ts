export type TelegramAction = {
  type: "telegram";
  message: string;
  chatId: string;
};

export type OutputAction = TelegramAction;
