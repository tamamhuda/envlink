import type { components } from "~/types/api";

export type User = components["schemas"]["UserInfoResponse"]["data"];
export type Tokens =
  components["schemas"]["AuthenticatedResponse"]["data"]["tokens"];
export type TokensResponse = components["schemas"]["TokensResponse"];
export type AuthResponse = components["schemas"]["AuthenticatedResponse"];
export type ErrorResponse = components["schemas"]["ErorrResponse"];
export type UserResponse = components["schemas"]["UserInfoResponse"];
export type ChangePasswordRequest = components["schemas"]["ChangePasswordDto"];
export type UpdateUserRequest = components["schemas"]["UpdateUserBodyDto"];
export type LoginRequest = components["schemas"]["LoginBodyDto"];
export type RegisterRequest = components["schemas"]["RegisterBodyDto"];
