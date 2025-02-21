import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { renderElements } from "@/utils/render-elements";
import { useEffect, useState } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";

type ProductSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  required?: boolean;
  className?: string;
};

export const ProductSelect = <T extends FieldValues>({
  name,
  label,
  required = false,
  className,
}: ProductSelectProps<T>) => {
  const form = useFormContext<T>();
  const { data: products, isLoading: isProductsLoading } =
    api.product.getAll.useQuery({
      params: {
        limit: 100,
      },
    });
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (form.control && products && !isProductsLoading) {
      setIsReady(true);
    }
  }, [form.control, products, isProductsLoading]);

  if (!isReady) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel className="capitalize">
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <Select
            onValueChange={onChange}
            value={value ?? ""}
            defaultValue={value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={`Pilih ${label?.toLocaleLowerCase()}`}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {renderElements({
                of: products?.data,
                keyExtractor: (product) => product.id,
                render: (product) => (
                  <SelectItem
                    key={product.id}
                    value={product.id}
                    className="capitalize"
                  >
                    {product.name}
                  </SelectItem>
                ),
                fallback: (
                  <SelectItem value={""}>Tidak ada data produk</SelectItem>
                ),
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
