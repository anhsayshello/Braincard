import AuthResponse from "@/types/auth.type";
import http from "@/utils/http";

export const URL_USERNAMELOGIN = "auth/usernameLogin";
export const URL_GOOGLELOGIN = "auth/googleLogin";
export const URL_REGISTER = "auth/register";
export const URL_LOGOUT = "auth/logout";

const authApi = {
  register: (body: { name: string; username: string; password: string }) =>
    http.post<AuthResponse>(URL_REGISTER, body),
  login: (body: { username: string; password: string }) =>
    http.post<AuthResponse>(URL_USERNAMELOGIN, body),
  logout: () => http.post<string>(URL_LOGOUT),

  google: (code: string) => http.post(`${URL_GOOGLELOGIN}?code=${code}`),
};

export default authApi;
