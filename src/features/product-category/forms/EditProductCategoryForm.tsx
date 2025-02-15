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
import { updateProductCategoryFormSchema } from "../schemas";
import type { UpdateProductCategoryFormSchema } from "../types";
import { EditProductCategoryFormInner } from "./EditProductCategoryFormInner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/utils/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";

type EditProductCategoryFormProps = {
  productCategoryId: string;
};

export const EditProductCategoryForm = ({
  productCategoryId,
}: EditProductCategoryFormProps) => {
  const router = useRouter();
  const { data: productCategory } = api.productCategory.getById.useQuery(
    {
      id: productCategoryId,
    },
    {
      enabled: !!productCategoryId,
    },
  );
  const form = useForm<UpdateProductCategoryFormSchema>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(updateProductCategoryFormSchema),
  });

  const {
    mutate: updateProductCategory,
    isPending: isUpdateProductCategoryPending,
  } = api.productCategory.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil memperbarui kategori produk");
      void router.replace("/dashboard/product-category");
    },
  });

  const onSubmit = (values: UpdateProductCategoryFormSchema) =>
    updateProductCategory({ id: productCategoryId, request: values });

  useEffect(() => {
    if (productCategory) {
      form.reset({
        ...productCategory,
        description: productCategory.description ?? "",
      });
    }
  }, [form, productCategory]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <EditProductCategoryFormInner
            formId="update-product-category-form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="mt-10 place-content-end">
        <Button
          form="update-product-category-form"
          disabled={isUpdateProductCategoryPending || !form.formState.isDirty}
        >
          {!isUpdateProductCategoryPending ? (
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
