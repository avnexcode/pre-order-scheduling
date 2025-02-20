import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import type { CreateCustomerFormSchema } from "../types";
import { createCustomerFormSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { CreateCustomerFormInner } from "./CreateCustomerFormInner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { toast as sonner } from "sonner";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export const CreateCustomerForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<CreateCustomerFormSchema>({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      email: "",
    },
    resolver: zodResolver(createCustomerFormSchema),
  });

  const { mutate: createCustomer, isPending: isCreateCustomerPending } =
    api.customer.create.useMutation({
      onSuccess: () => {
        sonner.success("Berhasil menambahkan data pelanggan");
        void router.replace("/dashboard/customer");
      },
      onError: (error) => {
        toast({
          title: "Error",
          variant: "destructive",
          description: error.message,
        });
      },
    });

  const onSubmit = (values: CreateCustomerFormSchema) => createCustomer(values);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Buat Data Pelanggan</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <CreateCustomerFormInner
            formId="create-customer-form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="mt-10 place-content-end">
        <Button form="create-customer-form" disabled={isCreateCustomerPending}>
          {!isCreateCustomerPending ? (
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
