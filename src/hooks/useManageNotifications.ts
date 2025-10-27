import notificationApi from "@/apis/notification.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useManageNotifications() {
  const queryClient = useQueryClient();

  const { data: dataNotifications, refetch } = useQuery({
    queryKey: ["notification"],
    queryFn: () => notificationApi.get(),
  });

  const readOneNotificationMutation = useMutation({
    mutationFn: notificationApi.readOne,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const readAllNotificationsMutation = useMutation({
    mutationFn: notificationApi.readAll,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
  });

  const deleteOneNotificationMutation = useMutation({
    mutationFn: notificationApi.deleteOne,
    onSuccess: () => {
      refetch();
    },
  });
  const deleteAllNotificationsMutation = useMutation({
    mutationFn: notificationApi.deleteAll,
    onSuccess: (data) => {
      console.log(data);
      refetch();
    },
  });

  return {
    dataNotifications,
    deleteOneNotificationMutation,
    deleteAllNotificationsMutation,
    readOneNotificationMutation,
    readAllNotificationsMutation,
  };
}
