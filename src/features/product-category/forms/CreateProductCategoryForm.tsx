import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CreateProductCategoryFormInner } from "./CreateProductCategoryFormInner";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductCategoryFormSchema } from "../schemas";
import type { CreateProductCategoryFormSchema } from "../types";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";

export const CreateProductCategoryForm = () => {
  const router = useRouter();
  const form = useForm<CreateProductCategoryFormSchema>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(createProductCategoryFormSchema),
  });

  const {
    mutate: createProductCategory,
    isPending: isCreateProductCategoryPending,
  } = api.productCategory.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menambahkan product category");
      void router.replace("/dashboard/product-category");
    },
  });

  const onSubmit = (values: CreateProductCategoryFormSchema) =>
    createProductCategory(values);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <CreateProductCategoryFormInner
            formId="create-product-category-form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="mt-10 place-content-end">
        <Button
          form="create-product-category-form"
          disabled={isCreateProductCategoryPending}
        >
          {!isCreateProductCategoryPending ? (
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
