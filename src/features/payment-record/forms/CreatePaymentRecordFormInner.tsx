import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { CreatePaymentRecordFormSchema } from "../types";

type CreatePaymentRecordFormInnerProps = {
  formId: string;
  onSubmit: (values: CreatePaymentRecordFormSchema) => void;
};

export const CreatePaymentRecordFormInner = ({
  formId,
  onSubmit,
}: CreatePaymentRecordFormInnerProps) => {
  const form = useFormContext<CreatePaymentRecordFormSchema>();

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
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
