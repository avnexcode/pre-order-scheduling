import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import type { CreateOrderFormSchema } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrderFormSchema } from "../schemas";
import { Form } from "@/components/ui/form";
import { CreateOrderFormInner } from "./CreateOrderFormInner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { useRouter } from "next/router";

export const CreateOrderForm = () => {
  const router = useRouter();
  const form = useForm<CreateOrderFormSchema>({
    defaultValues: {
      label: "",
      description: "",
      total: "",
      product_id: "",
      customer_id: "",
      category: "WHOLESALE",
    },
    resolver: zodResolver(createOrderFormSchema),
  });
  const { mutate: createOrder, isPending: isCreateOrderPending } =
    api.order.create.useMutation({
      onSuccess: () => {
        toast.success("Berhasil membuat pesanan baru");
        void router.replace("/dashboard/order");
      },
    });

  const onSubmit = (values: CreateOrderFormSchema) => createOrder(values);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <CreateOrderFormInner
            formId="create-order-form"
            onSubmit={onSubmit}
          />
        </Form>
      </CardContent>
      <CardFooter className="place-content-end pt-10">
        <Button form="create-order-form" disabled={isCreateOrderPending}>
          {!isCreateOrderPending ? (
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
