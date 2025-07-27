import AuthResponse from "@/types/auth.type";
import http from "@/utils/http";

export const URL_LOGIN = "auth/login";
export const URL_REGISTER = "auth/register";
export const URL_LOGOUT = "auth/logout";

const authApi = {
  register: (body: { name: string; username: string; password: string }) =>
    http.post<AuthResponse>(URL_REGISTER, body),
  login: (body: { username: string; password: string }) =>
    http.post<AuthResponse>(URL_LOGIN, body),
  logout: () => http.post<string>(URL_LOGOUT),
};

export default authApi;
