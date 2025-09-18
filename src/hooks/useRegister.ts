import authApi from "@/apis/auth.api";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";
import { useProfileStore } from "@/stores/useProfileStore";
import { registerSchema, RegisterSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

export default function useRegister() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const setIsAuthenticated = useAuthenticatedStore(
    (state) => state.setIsAuthenticated
  );
  const setProfile = useProfileStore((state) => state.setProfile);
  const navigate = useNavigate();
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      console.log(data);
      setIsAuthenticated(true);
      setProfile(data.data.user);
      navigate("/");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage =
        axiosError.response?.data?.error ||
        (error instanceof Error ? error.message : "Something went wrong");

      form.setError("username", {
        message: errorMessage,
      });

      console.error("Form Error:", errorMessage);
    },
  });

  const onSubmit = useCallback(
    (data: RegisterSchema) => {
      registerMutation.mutate(data);
    },
    [registerMutation]
  );

  return { form, registerMutation, onSubmit };
}
