import notificationApi from "@/apis/notification.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import Notification from "@/types/notification.type";
import { useSearchParams } from "react-router";

export default function useNotifications() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDeleteAllDialog, setOpenDeleteAllDialog] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification>();

  const { data: dataNotifications, refetch } = useQuery({
    queryKey: ["notification"],
    queryFn: () => notificationApi.get(),
  });
  console.log(searchParams);

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
      setOpenDeleteAllDialog(false);
    },
  });

  const handleReadOne = useCallback(
    (notification: Notification) => {
      setSearchParams({ id: notification.id });
      setSelectedNotification(notification);
      setOpenNotification(true);
      if (notification.isRead === false) {
        readOneNotificationMutation.mutate(notification.id);
      }
    },
    [
      setSearchParams,
      setSelectedNotification,
      setOpenNotification,
      readOneNotificationMutation,
    ]
  );

  const handleReadAll = useCallback(() => {
    readAllNotificationsMutation.mutate();
  }, [readAllNotificationsMutation]);

  const handleDeleteOne = useCallback(
    (notification: Notification) => {
      deleteOneNotificationMutation.mutate(notification.id);
    },
    [deleteOneNotificationMutation]
  );

  const handleDeleteAll = useCallback(() => {
    deleteAllNotificationsMutation.mutate();
  }, [deleteAllNotificationsMutation]);

  const getDropdownOptions = useCallback(
    (notification: Notification) => [
      {
        onClick: () => handleDeleteOne(notification),
        name: "Delete",
      },
    ],
    [handleDeleteOne]
  );

  const isReadAll = useMemo(
    () => dataNotifications?.data.every((noti) => noti.isRead === true),
    [dataNotifications]
  );

  return {
    dataNotifications,
    isReadAll,
    handleReadOne,
    handleReadAll,
    handleDeleteOne,
    handleDeleteAll,
    getDropdownOptions,
    deleteAllNotificationsMutation,
    openNotification,
    setOpenNotification,
    selectedNotification,
    openDeleteAllDialog,
    setOpenDeleteAllDialog,
  };
}
