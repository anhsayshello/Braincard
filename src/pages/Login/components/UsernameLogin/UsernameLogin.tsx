import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import Spinner from "@/components/Spinner";
import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";

export default function Login() {
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
  return (
    <>
      <Form {...form}>
        <form
          id="login-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        id="username"
                        type="username"
                        required
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <FormLabel>password</FormLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="password"
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      <Button
        form="login-form"
        type="submit"
        className="w-full cursor-pointer mt-6"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? <Spinner /> : "Login"}
      </Button>
    </>
  );
}
