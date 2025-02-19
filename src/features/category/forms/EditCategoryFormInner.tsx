import { useFormContext } from "react-hook-form";
import type { UpdateCategoryFormSchema } from "../types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type EditCategoryFormInnerProps = {
  formId: string;
  onSubmit: (values: UpdateCategoryFormSchema) => void;
};

export const EditCategoryFormInner = ({
  formId,
  onSubmit,
}: EditCategoryFormInnerProps) => {
  const form = useFormContext<UpdateCategoryFormSchema>();
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
              Name Kategori<span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan nama kategori produk" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deskripsi Kategori</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Masukkan deskripsi kategori produk"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
};
