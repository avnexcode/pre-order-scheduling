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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomerSelect } from "@/features/customer/components";
import { ProductSelect } from "@/features/product/components";
import { OrderCategory } from "@prisma/client";

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
            <FormLabel>
              Label <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan label" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex w-full items-center gap-5">
        <CustomerSelect<UpdateOrderFormSchema>
          name="customer_id"
          label="Pelanggan"
          required
        />
        <ProductSelect<UpdateOrderFormSchema>
          name="product_id"
          label="Produk"
          required
        />
      </div>
      <FormField
        control={form.control}
        name="total"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Total Pesanan <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Masukkan total pesanan" {...field} />
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
            <FormLabel>Deskripsi</FormLabel>
            <FormControl>
              <Textarea placeholder="Masukkan deskripsi pesanan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="category"
        render={({ field: { onChange, value } }) => (
          <FormItem>
            <FormLabel>Kategori Pesanan</FormLabel>
            <Select onValueChange={onChange} defaultValue={value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={`Pilih status pesanan`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem
                  value={OrderCategory.WHOLESALE}
                  className="capitalize"
                >
                  Grosir
                </SelectItem>
                <SelectItem value={OrderCategory.RETAIL} className="capitalize">
                  Ecer
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </form>
  );
};
