import notificationApi from "@/apis/notification.api";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X, Mail, MailOpen, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppDropDownMenu from "@/components/AppDropDownMenu";
import { useCallback, useMemo, useState } from "react";
import Notification from "@/types/notification.type";
import {
  AlertDialog as DeleteDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Spinner from "@/components/Spinner";
import classNames from "classnames";
import { useSearchParams } from "react-router";
import getTimeAgo from "@/helpers/getTimeAgo";
import EmptyNotification from "./components/EmptyNotification";
import Metadata from "@/components/Metadata";

export default function Notifications() {
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

  return (
    <>
      <Metadata title="Notifications | BrainCard" content="notifs" />
      <div className="flex items-center gap-3 pt-5">
        <div className="text-2xl font-semibold">Notifications</div>
      </div>
      <div className="mt-3.5 flex items-center text-sm gap-3">
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          disabled={isReadAll || !dataNotifications}
          onClick={handleReadAll}
        >
          <Check />
          Mark all as read
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-destructive hover:text-destructive cursor-pointer"
          disabled={dataNotifications?.data.length === 0 || !dataNotifications}
          onClick={() => setOpenDeleteAllDialog(true)}
        >
          <X />
          Clear all
        </Button>
      </div>
      <div className="mt-4">
        {dataNotifications &&
          dataNotifications.data.map((notification) => (
            <div className="mb-3" key={notification.id}>
              <Card
                className={classNames("gap-2", {
                  "border-blue-300": !notification.isRead,
                })}
              >
                <CardHeader className="flex justify-between">
                  <CardTitle
                    className="truncate flex items-end gap-2 cursor-pointer mr-2"
                    onClick={() => handleReadOne(notification)}
                  >
                    {!notification.isRead ? (
                      <Mail className="shrink-0 text-blue-400 w-4.5 h-4.5" />
                    ) : (
                      <MailOpen className="shrink-0 text-blue-400 w-4.5 h-4.5" />
                    )}
                    <div className="truncate">{notification.title}</div>
                  </CardTitle>
                  <AppDropDownMenu options={getDropdownOptions(notification)} />
                </CardHeader>
                <CardContent
                  className="cursor-pointer"
                  onClick={() => handleReadOne(notification)}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="opacity-70" size={14} />
                    <div>{getTimeAgo(notification.createdAt)}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        {(!dataNotifications || dataNotifications?.data.length === 0) && (
          <EmptyNotification />
        )}
      </div>

      {/* Open notificaiton */}
      <Dialog open={openNotification} onOpenChange={setOpenNotification}>
        <DialogContent>
          <DialogHeader className="text-left break-all">
            <DialogTitle className="mb-2 mr-4">
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedNotification?.content}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Delete All */}
      <DeleteDialog
        open={openDeleteAllDialog}
        onOpenChange={setOpenDeleteAllDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              notifications.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteAllDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAll}
              className="cursor-pointer bg-red-500 hover:bg-red-400"
              disabled={deleteAllNotificationsMutation.isPending}
            >
              {deleteAllNotificationsMutation.isPending ? (
                <Spinner />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DeleteDialog>
    </>
  );
}
