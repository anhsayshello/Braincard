import AuthResponse from "@/types/auth.type";
import http from "@/utils/http";

export const URL_LOGIN = "login";
export const URL_REGISTER = "register";
export const URL_LOGOUT = "logout";

const authApi = {
  register: (body: { name: string; username: string; password: string }) =>
    http.post<AuthResponse>(URL_REGISTER, body),
  login: (body: { username: string; password: string }) =>
    http.post<AuthResponse>(URL_LOGIN, body),
  logout: () => http.post<string>(URL_LOGOUT),
};

export default authApi;
