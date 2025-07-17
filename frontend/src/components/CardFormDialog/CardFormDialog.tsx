import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import cardApi from "@/apis/card.api";
import { useParams } from "react-router";
import { Card } from "@/types/card.type";
import { CardSchema, cardSchema } from "@/utils/schema";
import Spinner from "../Spinner";
import { toast } from "sonner";
import handleFormError from "@/helpers/handleFormError";
import dateFormatter from "@/helpers/dateFormatter";

interface CardFormDialogProps {
  mode: "create" | "update";
  card?: Card; // Chỉ cần khi mode = 'update'
  trigger?: React.ReactNode; // Custom trigger button
  onSuccess?: () => void; // Callback sau khi thành công
  externalOpen?: boolean;
  setExternalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CardFormDialog({
  mode,
  card,
  trigger,
  onSuccess,
  externalOpen,
  setExternalOpen,
}: CardFormDialogProps) {
  const [open, setOpen] = useState(false);
  const { deckId } = useParams();
  const controlledOpen = externalOpen ?? open;
  const setControlledOpen = setExternalOpen ?? setOpen;
  const queryClient = useQueryClient();

  const form = useForm<CardSchema>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      frontCard: card?.frontCard || "",
      backCard: card?.backCard || "",
    },
  });

  // Reset form khi card thay đổi (cho update mode)
  useEffect(() => {
    if (mode === "update" && card) {
      form.reset({
        frontCard: card.frontCard,
        backCard: card.backCard,
      });
    }
  }, [card, mode, form]);

  // Mutation cho create card
  const createCardMutation = useMutation({
    mutationFn: cardApi.createCard,
  });

  // Mutation cho update card
  const updateCardMutation = useMutation({
    mutationFn: cardApi.updateCard,
  });

  const onSubmit = useCallback(
    (data: CardSchema) => {
      if (!deckId && !card) return;

      if (mode === "create") {
        createCardMutation.mutate(
          {
            deckId: deckId || (card?.deckId as string),
            body: { frontCard: data.frontCard, backCard: data.backCard },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["deckCards", deckId],
              });
              queryClient.invalidateQueries({
                queryKey: ["allCards"],
              });
              form.reset();
              toast(`Card "${data.frontCard}" has been created`, {
                description: (
                  <div className="text-black">{dateFormatter()}</div>
                ),
                duration: 1500,
              });
              onSuccess?.();
            },
            onError: (error) => handleFormError(form, error, "frontCard"),
          }
        );
      } else if (mode === "update" && card) {
        updateCardMutation.mutate(
          {
            deckId: deckId || (card?.deckId as string),
            cardId: card.id,
            body: { frontCard: data.frontCard, backCard: data.backCard },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["deckCards", card.deckId],
              });
              queryClient.invalidateQueries({
                queryKey: ["allCards"],
              });
              setControlledOpen(false);
              onSuccess?.();
            },
            onError: (error) => handleFormError(form, error, "frontCard"),
          }
        );
      }
    },
    [
      card,
      mode,
      deckId,
      createCardMutation,
      updateCardMutation,
      queryClient,
      form,
      onSuccess,
      setControlledOpen,
    ]
  );

  const isLoading =
    createCardMutation.isPending || updateCardMutation.isPending;

  return (
    <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent showCloseButton={false} aria-describedby={undefined}>
        <VisuallyHidden asChild>
          <DialogTitle>
            {mode === "create" ? "Add New Card" : "Update Card"}
          </DialogTitle>
        </VisuallyHidden>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="frontCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1.5">Front</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        "Generally used for inputting questions, such as 'How many legs does a duck have?'"
                      }
                      {...field}
                      className="min-h-20 max-h-45 text-sm"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1.5">Back</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Generally used for inputting answers, such as 'A duck has 2 legs'"
                      {...field}
                      className="min-h-30 max-h-70 text-sm"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="fixed top-3 right-3.5 p-1.5 cursor-pointer hover:opacity-50 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
            </button>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isLoading}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export các component riêng biệt để dễ sử dụng
export function CreateCard(props: Omit<CardFormDialogProps, "mode">) {
  return <CardFormDialog {...props} mode="create" />;
}

export function UpdateCard(
  props: Omit<CardFormDialogProps, "mode"> & { card: Card }
) {
  return <CardFormDialog {...props} mode="update" />;
}
