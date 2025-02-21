import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { CreateCategoryFormInner } from "./CreateCategoryFormInner";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategoryFormSchema } from "../schemas";
import type { CreateCategoryFormSchema } from "../types";
import { api } from "@/utils/api";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { toast } from "sonner";

export const CreateCategoryForm = () => {
  const router = useRouter();
  const form = useForm<CreateCategoryFormSchema>({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: zodResolver(createCategoryFormSchema),
  });

  const { mutate: createCategory, isPending: isCreateCategoryPending } =
    api.category.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil menambahkan  category");
        void router.replace("/dashboard/category");
      },
    });

  const onSubmit = (values: CreateCategoryFormSchema) => createCategory(values);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <CreateCategoryFormInner
            formId="create--category-form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="mt-10 place-content-end">
        <Button form="create--category-form" disabled={isCreateCategoryPending}>
          {!isCreateCategoryPending ? (
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
