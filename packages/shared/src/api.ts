import { Flow } from "./flow";
import { RunnerResult } from "./runner";

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

export type ValidateResponse =
  | { isValid: true }
  | { isValid: false; error?: string };

export type DebugResponse = RunnerResult | { type: "error"; message: string };
