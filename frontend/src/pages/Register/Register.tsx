import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { registerSchema, RegisterSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import path from "@/constants/path";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";
import { House } from "lucide-react";
import Spinner from "@/components/Spinner";
import { useProfileStore } from "@/stores/useProfileStore";
import { AxiosError } from "axios";
import { useCallback } from "react";
import Metadata from "@/components/Metadata";

export default function Register() {
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
  return (
    <>
      <Metadata title="Sign up" content="sign-up" />
      <div className="fixed inset-0 flex items-center justify-center p-6 z-20 bg-[oklab(0_0_0_/_0.5)]">
        <Card className="w-full max-w-sm">
          <Link to={path.home} className="flex items-center justify-center">
            <House size={18} />
          </Link>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your username below to create your account
            </CardDescription>
            <CardAction>
              <Link to={path.login}>
                <Button variant="link">Login</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-1.5">
            <Form {...form}>
              <form
                id="register-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="flex flex-col gap-4.5">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="name"
                              id="name"
                              type="name"
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
                          <FormLabel>password</FormLabel>
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
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-4">
            <Button
              form="register-form"
              type="submit"
              className="w-full cursor-pointer"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? <Spinner /> : "Create account"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
