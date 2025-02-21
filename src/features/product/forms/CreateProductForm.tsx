import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CreateProductFormInner } from "./CreateProductFormInner";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductFormSchema } from "../schemas";
import type { CreateProductFormSchema } from "../types";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";

export const CreateProductForm = () => {
  const router = useRouter();
  const form = useForm<CreateProductFormSchema>({
    defaultValues: {
      name: "",
      price: "",
      category_id: "",
      description: "",
    },
    resolver: zodResolver(createProductFormSchema),
  });

  const { mutate: createProduct, isPending: isCreateProductPending } =
    api.product.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil menambahkan product ");
        void router.replace("/dashboard/product");
      },
    });

  const onSubmit = (values: CreateProductFormSchema) => createProduct(values);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <CreateProductFormInner
            formId="create-product--form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="mt-10 place-content-end">
        <Button form="create-product--form" disabled={isCreateProductPending}>
          {!isCreateProductPending ? (
            "Tambahkan"
          ) : (
            <>
              <Loader2 className="animate-spin" />
              Menambahkan...
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
