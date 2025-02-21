import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast as sonner } from "sonner";
import { updatePaymentRecordFormSchema } from "../schemas";
import type { UpdatePaymentRecordFormSchema } from "../types";
import { EditPaymentRecordFormInner } from "./EditPaymentRecordFormInner";
import { Button } from "@/components/ui/button";
import { Loader2, SquarePen } from "lucide-react";

type EditPaymentRecordFormProps = {
  paymentRecordId: string;
  refetchTransaction: () => void;
};

export const EditPaymentRecordForm = ({
  paymentRecordId,
  refetchTransaction,
}: EditPaymentRecordFormProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const form = useForm<UpdatePaymentRecordFormSchema>({
    defaultValues: {
      amount: "",
    },
    resolver: zodResolver(updatePaymentRecordFormSchema),
  });

  const { data: paymentRecord, isLoading: isPaymentRecordLoading } =
    api.paymentRecord.getById.useQuery(
      {
        id: paymentRecordId,
      },
      {
        enabled: !!paymentRecordId,
      },
    );

  useEffect(() => {
    if (paymentRecord) {
      form.reset({ amount: paymentRecord.amount });
    }
  }, [form, paymentRecord]);

  const {
    mutate: updatePaymentRecord,
    isPending: isUpdatePaymentRecordPending,
  } = api.paymentRecord.update.useMutation({
    onSuccess: () => {
      sonner.success("Berhasil memperbarui riwayat pembayaran");
      setIsDialogOpen(false);
      refetchTransaction();
    },
    onError: (error) => {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    },
  });

  const onSubmit = (values: UpdatePaymentRecordFormSchema) =>
    updatePaymentRecord({ id: paymentRecordId, request: values });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <EditPaymentRecordFormInner
            formId="update-payment-record-form"
            onSubmit={onSubmit}
          />
        </Form>
        <DialogFooter>
          <Button
            form="update-payment-record-form"
            disabled={isUpdatePaymentRecordPending || !form.formState.isDirty}
          >
            {!isUpdatePaymentRecordPending ? (
              "Perbarui"
            ) : (
              <>
                <Loader2 className="animate-spin" />
                Memperbarui...
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
