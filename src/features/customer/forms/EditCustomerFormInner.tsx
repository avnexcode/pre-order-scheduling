import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import type { CreateCustomerFormSchema } from "../types";

type EditCustomerFormInnerProps = {
  formId: string;
  onSubmit: (values: CreateCustomerFormSchema) => void;
};

export const EditCustomerFormInner = ({
  formId,
  onSubmit,
}: EditCustomerFormInnerProps) => {
  const form = useFormContext<CreateCustomerFormSchema>();

  return (
    <form
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Name Pelanggan<span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan nama pelanggan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Alamat Pelanggan<span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan alamat pelanggan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              No Handphone Pelanggan<span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan no hp pelanggan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Pelanggan</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan email pelanggan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
};
