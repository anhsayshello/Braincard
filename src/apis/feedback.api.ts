import http from "@/utils/http";

const feedbackApi = {
  send: (body: { content: string; type: number }) =>
    http.post("feedback", body),
};
export default feedbackApi;
