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
import { loginSchema, LoginSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import path from "@/constants/path";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/apis/auth.api";
import { useAuthenticatedStore } from "@/stores/useAuthenticatedStore";
import { House } from "lucide-react";
import Spinner from "@/components/Spinner";
import { useProfileStore } from "@/stores/useProfileStore";
import { useCallback } from "react";
import Metadata from "@/components/Metadata";

export default function Login() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const setIsAuthenticated = useAuthenticatedStore(
    (state) => state.setIsAuthenticated
  );
  const setProfile = useProfileStore((state) => state.setProfile);
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log(data);
      setIsAuthenticated(true);
      setProfile(data.data.user);
      navigate("/");
    },
  });

  const onSubmit = useCallback(
    (data: LoginSchema) => {
      loginMutation.mutate(data);
    },
    [loginMutation]
  );
  return (
    <>
      <Metadata title="Login" content="login" />
      <div className="fixed inset-0 flex items-center justify-center p-6 z-20 bg-[oklab(0_0_0_/_0.5)]">
        <Card className="w-full max-w-sm">
          <Link to={path.home} className="flex items-center justify-center">
            <House size={18} />
          </Link>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your username below to login to your account
            </CardDescription>
            <CardAction>
              <Link to={path.register}>
                <Button variant="link">Sign Up</Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="pt-1.5">
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
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-3.5">
            <Button
              form="login-form"
              type="submit"
              className="w-full cursor-pointer"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? <Spinner /> : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
