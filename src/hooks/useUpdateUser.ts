import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { userSchema, UserSchema } from "@/utils/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import userApi from "@/apis/user.api";
import { toast } from "sonner";
import useUserQuery from "@/hooks/useUserQuery";
import { useProfileStore } from "@/stores/useProfileStore";

export default function useUpdateUser() {
  const [isUpdate, setIsUpdate] = useState(false);

  const profile = useProfileStore((state) => state.profile);
  console.log(profile, "zustand subcribe");

  const { data } = useUserQuery();
  const dataUser = useMemo(() => data?.data, [data]);

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: dataUser?.name ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      name: dataUser?.name,
    });
  }, [dataUser?.name, form]);

  const queryClient = useQueryClient();
  const updateUserMutation = useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Updated successfully");
      setIsUpdate(false);
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Something went wrong");
    },
  });

  const onSubmit = (data: UserSchema) => {
    updateUserMutation.mutate(data);
  };

  const isPending = updateUserMutation.isPending;

  return {
    isUpdate,
    setIsUpdate,
    dataUser,
    form,
    onSubmit,
    isPending,
  };
}
