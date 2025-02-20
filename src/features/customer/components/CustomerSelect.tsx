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

type CustomerSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  required?: boolean;
  className?: string;
};

export const CustomerSelect = <T extends FieldValues>({
  name,
  label,
  required = false,
  className,
}: CustomerSelectProps<T>) => {
  const form = useFormContext<T>();
  const { data: customers, isLoading: isCustomersLoading } =
    api.customer.getAll.useQuery({
      params: {
        limit: 100,
      },
    });
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (form.control && customers && !isCustomersLoading) {
      setIsReady(true);
    }
  }, [form.control, customers, isCustomersLoading]);

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
                <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {renderElements({
                of: customers?.data,
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
