import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { api } from "@/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createPaymentRecordFormSchema } from "../schemas";
import type { CreatePaymentRecordFormSchema } from "../types";
import { CreatePaymentRecordFormInner } from "./CreatePaymentRecordFormInner";

type CreatePaymentRecordFormProps = {
  transaction_id: string;
  refetchTransaction: () => void;
};

export const CreatePaymentRecordForm = ({
  transaction_id,
  refetchTransaction,
}: CreatePaymentRecordFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const form = useForm<CreatePaymentRecordFormSchema>({
    defaultValues: {
      amount: "",
    },
    resolver: zodResolver(createPaymentRecordFormSchema),
  });

  const {
    mutate: createPaymentRecord,
    isPending: isCreatePaymentRecordPending,
  } = api.paymentRecord.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menambahkan catatan pembayaran");
      refetchTransaction();
      setIsDialogOpen(false);
    },
  });

  const onSubmit = (values: CreatePaymentRecordFormSchema) =>
    createPaymentRecord({ ...values, transaction_id });

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Buat Catatan Pembayaran</Button>
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
          <CreatePaymentRecordFormInner
            formId="create-payment-record-form"
            onSubmit={onSubmit}
          />
        </Form>
        <DialogFooter>
          <Button
            form="create-payment-record-form"
            disabled={isCreatePaymentRecordPending}
          >
            {!isCreatePaymentRecordPending ? (
              "Tambahkan"
            ) : (
              <>
                <Loader2 className="animate-spin" />
                Menambahkan...
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
