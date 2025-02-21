import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateCategoryFormSchema } from "../schemas";
import type { UpdateCategoryFormSchema } from "../types";
import { EditCategoryFormInner } from "./EditCategoryFormInner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/utils/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";

type EditCategoryFormProps = {
  CategoryId: string;
};

export const EditCategoryForm = ({ CategoryId }: EditCategoryFormProps) => {
  const router = useRouter();
  const { data: category } = api.category.getById.useQuery(
    {
      id: CategoryId,
    },
    {
      enabled: !!CategoryId,
    },
  );
  const form = useForm<UpdateCategoryFormSchema>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(updateCategoryFormSchema),
  });

  const { mutate: updateCategory, isPending: isUpdateCategoryPending } =
    api.category.update.useMutation({
      onSuccess: () => {
        toast.success("Berhasil memperbarui kategori produk");
        void router.replace("/dashboard/category");
      },
    });

  const onSubmit = (values: UpdateCategoryFormSchema) =>
    updateCategory({ id: CategoryId, request: values });

  useEffect(() => {
    if (category) {
      form.reset({
        ...category,
        description: category.description ?? "",
      });
    }
  }, [form, category]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <EditCategoryFormInner
            formId="update--category-form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="mt-10 place-content-end">
        <Button
          form="update--category-form"
          disabled={isUpdateCategoryPending || !form.formState.isDirty}
        >
          {!isUpdateCategoryPending ? (
            "Perbarui"
          ) : (
            <>
              <Loader2 className="animate-spin" />
              Memperbarui...
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
