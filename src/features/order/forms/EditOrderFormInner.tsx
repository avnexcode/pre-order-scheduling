import { useFormContext } from "react-hook-form";
import type { UpdateOrderFormSchema } from "../types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type EditOrderFormInnerProps = {
  formId: string;
  onSubmit: (values: UpdateOrderFormSchema) => void;
};

export const EditOrderFormInner = ({
  formId,
  onSubmit,
}: EditOrderFormInnerProps) => {
  const form = useFormContext<UpdateOrderFormSchema>();
  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <FormField
        control={form.control}
        name="label"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="some" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
};
