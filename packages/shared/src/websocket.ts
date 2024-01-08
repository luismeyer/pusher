import { Flow } from "./flow";
import { RunnerResult } from "./runner";

export const runnerChannel = (flow: Flow) => `runner-channel-${flow.id}`;

export const RunnerDoneEvent = "done";

export type RunnerEvent = typeof RunnerDoneEvent;

export type RunnerPayloadMap = {
  [RunnerDoneEvent]: RunnerResult;
};
