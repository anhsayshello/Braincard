import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import deckApi from "@/apis/deck.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { deckSchema, DeckSchema } from "@/utils/schema";
import Deck from "@/types/deck.type";
import Spinner from "../Spinner";
import { toast } from "sonner";
import handleFormError from "@/helpers/handleFormError";

interface DeckFormDialogProps {
  mode: "create" | "update";
  deck?: Deck;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  externalOpen?: boolean;
  setExternalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DeckFormDialog({
  mode,
  deck,
  trigger,
  onSuccess,
  externalOpen,
  setExternalOpen,
}: DeckFormDialogProps) {
  const [open, setOpen] = useState(false);
  const controlledOpen = externalOpen ?? open;
  const setControlledOpen = setExternalOpen ?? setOpen;
  const deckId = deck?.id;
  const queryClient = useQueryClient();
  const form = useForm<DeckSchema>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      name: deck?.name || "",
    },
  });

  useEffect(() => {
    if (mode === "update" && deck) {
      form.reset({
        name: deck.name,
      });
    }
  }, [deck, mode, form]);

  const createDeckMutation = useMutation({
    mutationFn: deckApi.createDeck,
  });

  const updateDeckMutation = useMutation({
    mutationFn: deckApi.updateDeck,
  });

  const onSubmit = useCallback(
    (data: DeckSchema) => {
      if (mode === "create") {
        createDeckMutation.mutate(data, {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["decks"],
            });
            toast(`Deck "${data.name}" has been created`, {
              duration: 1500,
            });
            setControlledOpen(false);
            onSuccess?.();
          },
          onError: (error) => handleFormError(form, error, "name"),
        });
      } else if (mode === "update" && deck && deckId) {
        updateDeckMutation.mutate(
          { id: deckId, body: { name: data.name } },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["decks"],
              });
              setControlledOpen(false);
              onSuccess?.();
            },
            onError: (error) => handleFormError(form, error, "name"),
          }
        );
      }
    },
    [
      form,
      deck,
      mode,
      deckId,
      createDeckMutation,
      updateDeckMutation,
      onSuccess,
      queryClient,
      setControlledOpen,
    ]
  );

  const isLoading =
    createDeckMutation.isPending || updateDeckMutation.isPending;

  return (
    <>
      <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
        <DialogTrigger asChild>
          <div>{trigger}</div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {mode == "create" ? "Creating a memory deck" : "Renaming"}
            </DialogTitle>
            <DialogDescription>
              {mode == "create" ? "Click save when you're done" : ""}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="text-sm"
                            placeholder="Enter a name"
                            value={value}
                            onChange={onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <Spinner />
                  ) : mode === "create" ? (
                    "Create"
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CreateDeck(props: Omit<DeckFormDialogProps, "mode">) {
  return <DeckFormDialog {...props} mode="create" />;
}

export function UpdateDeck(
  props: Omit<DeckFormDialogProps, "mode"> & { deck: Deck }
) {
  return <DeckFormDialog {...props} mode="update" />;
}
