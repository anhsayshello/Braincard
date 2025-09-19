import Metadata from "@/components/Metadata";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SquarePen } from "lucide-react";
import AppTitle from "@/components/shared/app-title";
import useUpdateUser from "@/hooks/useUpdateUser";
export default function Account() {
  const { isUpdate, setIsUpdate, dataUser, form, onSubmit, isPending } =
    useUpdateUser();

  return (
    <>
      <Metadata title="Account | BrainCard" content="account" />
      <AppTitle title="Profile" />
      <div className="-mt-10 flex justify-center items-center h-screen">
        <Card className="w-fit gap-5">
          <CardHeader className="flex justify-center relative">
            <div className="flex flex-col gap-2 items-center">
              <Avatar className="rounded-lg">
                <AvatarImage
                  src={
                    dataUser?.image
                      ? dataUser.image
                      : "https://github.com/evilrabbit.png"
                  }
                  alt="@evilrabbit"
                />
                <AvatarFallback>{dataUser?.name}</AvatarFallback>
              </Avatar>
              <div className="text-xs">id: {dataUser?.id}</div>
            </div>
            <CardAction
              onClick={() => {
                setIsUpdate(true);
              }}
              className="absolute right-10 top-2 cursor-pointer hover:opacity-50"
            >
              <SquarePen size={18} />
            </CardAction>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormItem className="flex items-center gap-6 mb-5">
                  <FormLabel className="basis-1/4 justify-end">
                    {dataUser?.email ? "Email" : "Username"}
                  </FormLabel>
                  <div className="relative">
                    <FormControl className="basis-3/4">
                      <Input
                        className="border-none shadow-none"
                        placeholder="username"
                        value={
                          dataUser?.email ? dataUser?.email : dataUser?.username
                        }
                        readOnly
                      />
                    </FormControl>
                    <FormMessage className="absolute" />
                  </div>
                </FormItem>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-6 mb-5">
                      <FormLabel className="basis-1/4 justify-end">
                        Name
                      </FormLabel>
                      <div>
                        <FormControl className="basis-3/4">
                          <Input
                            disabled={isPending || !isUpdate}
                            placeholder="name"
                            {...field}
                            className="text-sm"
                          />
                        </FormControl>
                        <FormMessage className="mt-1" />
                      </div>
                    </FormItem>
                  )}
                />
                {/* <FormLabel>Change password</FormLabel> */}
                {isUpdate && (
                  <div className="flex items-center justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsUpdate(false);
                        form.reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex justify-self-center"
                      disabled={isPending}
                    >
                      Update
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
