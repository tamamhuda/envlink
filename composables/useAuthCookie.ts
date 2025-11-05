import { useCookie } from "#app";

export const useAuthCookie = () => {
  return useCookie("auth", {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    encode: String, // store as raw JSON string
    decode: String, // read as raw JSON string
  });
};
