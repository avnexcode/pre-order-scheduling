import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CreateProductFormSchema } from "../types";
import { ProductCategorySelect } from "@/features/product-category/components";

type CreateProductFormInnerProps = {
  formId: string;
  onSubmit: (values: CreateProductFormSchema) => void;
};

export const CreateProductFormInner = ({
  formId,
  onSubmit,
}: CreateProductFormInnerProps) => {
  const form = useFormContext<CreateProductFormSchema>();
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
              Name Produk<span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan nama produk" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Harga Produk<span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan nama produk" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ProductCategorySelect<CreateProductFormSchema>
        name="product_category_id"
        label="Kategori"
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deskripsi Produk</FormLabel>
            <FormControl>
              <Textarea placeholder="Masukkan deskripsi produk" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
};
