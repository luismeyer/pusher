export type RunnerSuccessResult = {
  type: "success";
};

export type RunnerErrorResult = {
  type: "error";
  message: string;
};

export type RunnerDebugResult = {
  type: "debug";
  videoUrl: string;
};

export type RunnerResult =
  | RunnerSuccessResult
  | RunnerErrorResult
  | RunnerDebugResult;
