import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { UpdatePaymentRecordFormSchema } from "../types";

type EditPaymentRecordFormInnerProps = {
  formId: string;
  onSubmit: (values: UpdatePaymentRecordFormSchema) => void;
};

export const EditPaymentRecordFormInner = ({
  formId,
  onSubmit,
}: EditPaymentRecordFormInnerProps) => {
  const form = useFormContext<UpdatePaymentRecordFormSchema>();
  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Masukkan Nominal<span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan nominal" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
};
