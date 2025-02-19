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
import { updateProductFormSchema } from "../schemas";
import type { UpdateProductFormSchema } from "../types";
import { EditProductFormInner } from "./EditProductFormInner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/utils/api";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/router";

type EditProductFormProps = {
  productId: string;
};

export const EditProductForm = ({ productId }: EditProductFormProps) => {
  const router = useRouter();
  const { data: product } = api.product.getById.useQuery(
    {
      id: productId,
    },
    {
      enabled: !!productId,
    },
  );
  const form = useForm<UpdateProductFormSchema>({
    defaultValues: {
      name: "",
      price: "",
      category_id: "",
      description: "",
    },
    resolver: zodResolver(updateProductFormSchema),
  });

  const { mutate: updateProduct, isPending: isUpdateProductPending } =
    api.product.update.useMutation({
      onSuccess: () => {
        toast.success("Berhasil memperbarui kategori produk");
        void router.replace("/dashboard/product");
      },
    });

  const onSubmit = (values: UpdateProductFormSchema) =>
    updateProduct({ id: productId, request: values });

  useEffect(() => {
    if (product) {
      form.reset({
        ...product,
        description: product.description ?? "",
      });
    }
  }, [form, product]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <EditProductFormInner
            formId="update-product--form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="mt-10 place-content-end">
        <Button
          form="update-product--form"
          disabled={isUpdateProductPending || !form.formState.isDirty}
        >
          {!isUpdateProductPending ? (
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
