import { Flow } from "./flow";

export type SubmitErrorResponse = {
  type: "error";
  message: string;
};

export type SubmitSuccessResponse = {
  type: "success";
};

export type SubmitResponse = SubmitErrorResponse | SubmitSuccessResponse;

export type LoadErrorResponse = {
  type: "error";
  message: string;
};

export type LoadSuccessResponse = {
  type: "success";
  flow: Flow;
};

export type LoadResponse = LoadErrorResponse | LoadSuccessResponse;
