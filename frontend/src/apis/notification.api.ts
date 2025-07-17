import Notification from "@/types/notification.type";
import http from "@/utils/http";

const URL = "notification";
const notificationApi = {
  get: () => http.get<Notification[]>(URL),
  getUnRead: () => http.get<{ unreadCount: number }>(`${URL}/unread-count`),
  readOne: (id: string) => http.put<Notification>(`${URL}/${id}`),
  readAll: () => http.put(`${URL}/all`),
  deleteOne: (id: string) => http.delete(`${URL}/${id}`),
  deleteAll: () => http.delete(`${URL}/all`),
};

export default notificationApi;
