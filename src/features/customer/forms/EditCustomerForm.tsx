import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast as sonner } from "sonner";
import { updateCustomerFormSchema } from "../schemas";
import type { UpdateCustomerFormSchema } from "../types";
import { CreateCustomerFormInner } from "./CreateCustomerFormInner";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

type EditCustomerFormProps = {
  customerId: string;
};

export const EditCustomerForm = ({ customerId }: EditCustomerFormProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: customer } = api.customer.getById.useQuery(
    { id: customerId },
    { enabled: !!customerId },
  );

  const form = useForm<UpdateCustomerFormSchema>({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      email: "",
    },
    resolver: zodResolver(updateCustomerFormSchema),
  });

  const { mutate: updateCustomer, isPending: isUpdateCustomerPending } =
    api.customer.update.useMutation({
      onSuccess: () => {
        sonner.success("Berhasil memperbarui data pelanggan");
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

  const onSubmit = (values: UpdateCustomerFormSchema) =>
    updateCustomer({
      id: customerId,
      request: values,
    });

  useEffect(() => {
    if (customer) {
      form.reset({ ...customer, email: customer.email ?? "" });
    }
  }, [form, customer]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Perbarui Data Pelanggan</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <CreateCustomerFormInner
            formId="update-customer-form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="mt-10 place-content-end">
        <Button
          form="update-customer-form"
          disabled={isUpdateCustomerPending || !form.formState.isDirty}
        >
          {!isUpdateCustomerPending ? (
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
