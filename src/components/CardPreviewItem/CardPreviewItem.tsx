import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { UpdateCard } from "@/components/CardFormDialog/CardFormDialog";
import { Card as CardType } from "@/types/card.type";
import Spinner from "@/components/Spinner";
import AppDropDownMenu from "@/components/AppDropDownMenu";
import { motion } from "motion/react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import CardDetailItem from "../CardDetailItem";
import { Checkbox } from "../ui/checkbox";
import useCardPreview from "@/hooks/useCardPreview";

export default function CardPreviewItem({
  card,
  isAllCards = false,
  handleCheck,
  isChecked,
}: {
  card: CardType;
  isAllCards?: boolean;
  handleCheck?: () => void;
  isChecked?: boolean;
}) {
  const {
    handleDeleteConfirm,
    handleOpenCardDetail,
    getDropdownOptions,
    openCardDetail,
    setOpenCardDetail,
    openDeleteDialog,
    setOpenDeleteDialog,
    openUpdateDialog,
    setOpenUpdateDialog,
    selectedCard,
    deleteCardMutation,
  } = useCardPreview();
  return (
    <>
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.05,
          ease: "linear",
        }}
      >
        <Card
          className="mb-1 cursor-pointer"
          onClick={() => handleOpenCardDetail(card)}
        >
          <CardHeader className="flex justify-between">
            <CardTitle
              onClick={() => handleOpenCardDetail(card)}
              className="text-xl cursor-pointer truncate mr-2"
            >
              <div className="truncate">{card.frontCard}</div>
            </CardTitle>
            <div onClick={(e) => e.stopPropagation()}>
              <AppDropDownMenu options={getDropdownOptions(card)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-5 overflow-hidden">
                <div className="flex items-center gap-1.5 text-sm leading-5">
                  <div className="text-black/60">Review</div>
                  <div className="font-semibold">{card.reviewCount}</div>
                </div>
                <div className="flex items-center gap-1.5 text-sm leading-5">
                  <div className="text-black/60">Forget</div>
                  <div className="font-semibold">{card.forgetCount}</div>
                </div>
                <div className="flex items-center gap-1.5 text-sm leading-5 overflow-hidden">
                  <div className="text-black/60 font-semibold truncate">
                    {card.timeUntilReview}
                  </div>
                </div>
              </div>
              {!isAllCards && handleCheck && (
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={isChecked} onCheckedChange={handleCheck} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Open card detail dialog */}
      <Dialog open={openCardDetail} onOpenChange={setOpenCardDetail}>
        <DialogContent showCloseButton={true} aria-describedby={undefined}>
          <VisuallyHidden asChild>
            <DialogTitle></DialogTitle>
          </VisuallyHidden>
          <CardDetailItem
            card={selectedCard as CardType}
            onClick={() => setOpenCardDetail(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <DeleteDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the "
              {selectedCard?.frontCard}" card and remove from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="cursor-pointer bg-red-500 hover:bg-red-400"
              disabled={deleteCardMutation.isPending}
            >
              {deleteCardMutation.isPending ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DeleteDialog>

      {/* Edit */}
      <UpdateCard
        externalOpen={openUpdateDialog}
        setExternalOpen={setOpenUpdateDialog}
        card={selectedCard as CardType}
      />
    </>
  );
}
