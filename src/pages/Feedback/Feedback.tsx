import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/Spinner";
import Metadata from "@/components/Metadata";
import AppTitle from "@/components/shared/app-title";
import useFeedback from "@/hooks/useFeedback";

export default function Feedback() {
  const { form, feedbackTypes, feedbackMutation, onSubmit } = useFeedback();
  return (
    <>
      <Metadata title="Feedback | BrainCard" content="feedback" />
      <AppTitle title="Feedback" />
      <div className="flex items-center justify-center mt-4 md:mt-8 xl:grow xl:-mt-20">
        <div className="grid w-full max-w-2xl items-center gap-4">
          <div className="w-full rounded-lg border px-5 py-4 text-sm">
            <div className="line-clamp-1 min-h-4 font-medium tracking-tight">
              Share Your Feedback
            </div>
            <p>
              Leave your message here to let us know what features or
              improvements you need
            </p>
            <div className="mt-2 line-clamp-1 min-h-4 font-medium tracking-tight"></div>

            <div className="mt-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="gap-4">
                        <FormLabel>Type of feedback: </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-2">
                            {feedbackTypes.map((type) => (
                              <Button
                                key={type.id}
                                type="button"
                                variant={
                                  type.id !== field.value
                                    ? "outline"
                                    : "default"
                                }
                                onClick={() => field.onChange(type.id)}
                              >
                                <type.icon />
                                {type.label}
                              </Button>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="gap-4">
                        <FormLabel>Your message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your message here."
                            className="min-h-40 max-h-70 text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={feedbackMutation.isPending}>
                    {feedbackMutation.isPending ? <Spinner /> : "Submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
