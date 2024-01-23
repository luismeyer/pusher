import { Flow } from "./flow";

export type AuthResponse<TData = undefined> =
  | { type: "unauthorized" }
  | { type: "success"; data?: TData }
  | { type: "error"; message: string };

export type SubmitResponse = AuthResponse<boolean>;

export type LoadResponse = AuthResponse<Flow>;

export type ValidateResponse = AuthResponse<boolean>;

export type DebugResponse = AuthResponse;

export type FlowsResponse = AuthResponse<Flow[]>;
