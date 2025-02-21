import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Trash } from "lucide-react";
import { toast } from "sonner";

type DeletePaymentRecordDialogProps = {
  paymentRecordId: string;
  refetchTransaction: () => void;
};

export const DeletePaymentRecordDialog = ({
  paymentRecordId,
  refetchTransaction,
}: DeletePaymentRecordDialogProps) => {
  const { mutate: deletePaymentRecord } = api.paymentRecord.delete.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menghapus data riwayat pembayaran");
      refetchTransaction();
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deletePaymentRecord({ id: paymentRecordId })}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
