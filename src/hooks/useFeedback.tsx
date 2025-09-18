import { Lightbulb, Bug, ThumbsUp, MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeedbackSchema, feedbackSchema } from "@/utils/schema";
import FEEDBACK_TYPE from "@/constants/feedback";
import { useMutation } from "@tanstack/react-query";
import feedbackApi from "@/apis/feedback.api";
import handleFormError from "@/helpers/handleFormError";
import { useCallback } from "react";
import { toast } from "sonner";

export const feedbackTypes = [
  {
    id: FEEDBACK_TYPE.FEATURE_REQUEST,
    label: "Feature Request",
    icon: Lightbulb,
  },
  {
    id: FEEDBACK_TYPE.IMPROVEMENTS,
    label: "Improvement",
    icon: ThumbsUp,
  },
  { id: FEEDBACK_TYPE.BUG_REPORT, label: "Bug Report", icon: Bug },
  {
    id: FEEDBACK_TYPE.OTHERS,
    label: "General Feedback",
    icon: MessageCircle,
  },
];

export default function useFeedback() {
  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
  });

  const feedbackMutation = useMutation({
    mutationFn: feedbackApi.send,
    onSuccess: () => {
      form.reset({ type: undefined, content: "" });
      toast.success("Your feedback has been submitted!", {
        description: (
          <div className="text-black">Thanks for sharing your thoughts!</div>
        ),
      });
    },
    onError: (error) => handleFormError(form, error, "content"),
  });

  const onSubmit = useCallback(
    (data: FeedbackSchema) => {
      console.log(data);
      if (typeof data.type === "number") {
        feedbackMutation.mutate(data);
      }
    },
    [feedbackMutation]
  );

  return { form, feedbackTypes, feedbackMutation, onSubmit };
}
