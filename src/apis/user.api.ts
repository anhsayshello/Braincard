import { Stats } from "@/types/user.type";
import http from "@/utils/http";

const userApi = {
  getStats: () => http.get<Stats>("users/stats"),
};

export default userApi;
