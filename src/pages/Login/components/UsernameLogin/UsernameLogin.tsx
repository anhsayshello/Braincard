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
import Spinner from "@/components/Spinner";
import useUsernameLogin from "@/hooks/useUsernameLogin";

export default function Login() {
  const { form, onSubmit, error, isPending } = useUsernameLogin();
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
        disabled={isPending}
      >
        {isPending ? <Spinner /> : "Login"}
      </Button>
    </>
  );
}
