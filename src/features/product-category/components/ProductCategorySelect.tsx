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
import { api } from "@/utils/api";
import { renderElements } from "@/utils/render-elements";
import { useEffect, useState } from "react";
import { useFormContext, type FieldValues, type Path } from "react-hook-form";

type ProductCategorySelectProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
};

export const ProductCategorySelect = <T extends FieldValues>({
  name,
  label,
}: ProductCategorySelectProps<T>) => {
  const form = useFormContext<T>();
  const { data: productCategories, isLoading: isProductCategoriesLoading } =
    api.productCategory.getAll.useQuery({});
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (form.control && productCategories && !isProductCategoriesLoading) {
      setIsReady(true);
    }
  }, [form.control, productCategories, isProductCategoriesLoading]);

  if (!isReady) {
    return (
      <div className="space-y-4">
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
        <FormItem>
          <FormLabel>{label ?? "Pilih kategori"}</FormLabel>
          <Select
            onValueChange={onChange}
            value={value ?? ""}
            defaultValue={value}
          >
            <FormControl>
              <SelectTrigger className="capitalize">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {renderElements({
                of: productCategories?.items,
                keyExtractor: (productCategory) => productCategory.id,
                render: (productCategory) => (
                  <SelectItem
                    key={productCategory.id}
                    value={productCategory.id}
                    className="capitalize"
                  >
                    {productCategory.name}
                  </SelectItem>
                ),
                fallback: (
                  <SelectItem value={"empty"}>
                    Tidak ada data kategori tersedia
                  </SelectItem>
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
