import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";

export default function useUsernameLogin() {
  const [error, setError] = useState("");
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      if (error.response) {
        setError(error.response.data.error);
      }
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      if (error) {
        setError("");
      }
    });
    return () => subscription.unsubscribe();
  }, [form, error]);

  const onSubmit = useCallback(
    (data: LoginSchema) => {
      loginMutation.mutate(data);
    },
    [loginMutation]
  );

  const isPending = loginMutation.isPending;

  return { form, onSubmit, error, isPending };
}
