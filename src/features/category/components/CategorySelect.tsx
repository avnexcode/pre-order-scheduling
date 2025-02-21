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

type CategorySelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  required?: boolean;
};

export const CategorySelect = <T extends FieldValues>({
  name,
  label,
  required = false,
}: CategorySelectProps<T>) => {
  const form = useFormContext<T>();
  const { data: categories, isLoading: isCategoriesLoading } =
    api.category.getAll.useQuery({
      params: {
        limit: 100,
      },
    });
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (form.control && categories && !isCategoriesLoading) {
      setIsReady(true);
    }
  }, [form.control, categories, isCategoriesLoading]);

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
                <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {renderElements({
                of: categories?.data,
                keyExtractor: (category) => category.id,
                render: (category) => (
                  <SelectItem
                    key={category.id}
                    value={category.id}
                    className="capitalize"
                  >
                    {category.name}
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
