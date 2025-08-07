import User, { Stats } from "@/types/user.type";
import http from "@/utils/http";

const URL = "users";

const userApi = {
  getMe: () => http.get<User>(`${URL}/me`),
  updateUser: (body: { name: string }) => http.post<User>(`${URL}`, body),
  getStats: () => http.get<Stats>(`${URL}/stats`),
};

export default userApi;
