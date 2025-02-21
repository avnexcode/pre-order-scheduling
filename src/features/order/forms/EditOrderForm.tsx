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
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast as sonner } from "sonner";
import { updateOrderFormSchema } from "../schemas";
import type { UpdateOrderFormSchema } from "../types";
import { EditOrderFormInner } from "./EditOrderFormInner";

type EditOrderFormProps = {
  orderId: string;
};

export const EditOrderForm = ({ orderId }: EditOrderFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<UpdateOrderFormSchema>({
    defaultValues: {
      label: "",
      description: "",
      total: "",
      product_id: "",
      customer_id: "",
      category: "WHOLESALE",
    },
    resolver: zodResolver(updateOrderFormSchema),
  });

  const { data: order } = api.order.getById.useQuery({ id: orderId });

  const { mutate: updateOrder, isPending: isUpdateOrderPending } =
    api.order.update.useMutation({
      onSuccess: () => {
        sonner.success("Berhasil memperbarui data pesanan");
        void router.replace("/dashboard/order");
      },
      onError: (error) => {
        toast({
          title: "Error",
          variant: "destructive",
          description: error.message,
        });
      },
    });

  const onSubmit = (values: UpdateOrderFormSchema) =>
    updateOrder({ id: orderId, request: values });

  useEffect(() => {
    if (order) {
      form.reset({ ...order, description: order.description ?? "" });
    }
  }, [form, order]);

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <EditOrderFormInner formId="update-order-form" onSubmit={onSubmit} />
        </Form>
      </CardContent>
      <CardFooter className="place-content-end">
        <Button
          form="update-order-form"
          disabled={isUpdateOrderPending || !form.formState.isDirty}
        >
          {!isUpdateOrderPending ? (
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
