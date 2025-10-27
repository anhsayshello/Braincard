import { useMutation } from "@tanstack/react-query";
import feedbackApi from "@/apis/feedback.api";

export default function useSendFeedback() {
  const sendFeedbackMutation = useMutation({
    mutationFn: feedbackApi.send,
  });

  return sendFeedbackMutation;
}
