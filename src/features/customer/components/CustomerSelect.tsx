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

type CustomerSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
};

export const CustomerSelect = <T extends FieldValues>({
  name,
  label,
}: CustomerSelectProps<T>) => {
  const form = useFormContext<T>();
  const { data: customers, isLoading: isCustomersLoading } =
    api.customer.getAll.useQuery({});
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (form.control && customers && !isCustomersLoading) {
      setIsReady(true);
    }
  }, [form.control, customers, isCustomersLoading]);

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
                of: customers?.items,
                keyExtractor: (customer) => customer.id,
                render: (customer) => (
                  <SelectItem
                    key={customer.id}
                    value={customer.id}
                    className="capitalize"
                  >
                    {customer.name}
                  </SelectItem>
                ),
                fallback: (
                  <SelectItem value={""}>
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
