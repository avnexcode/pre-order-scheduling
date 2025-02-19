import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditOrderFormInner } from "./EditOrderFormInner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateOrderFormSchema } from "../schemas";
import type { UpdateOrderFormSchema } from "../types";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const EditOrderForm = () => {
  const form = useForm<UpdateOrderFormSchema>({
    defaultValues: {
      label: "",
      description: "",
      total: "",
      product_id: "",
      customer_id: "",
      status: "PENDING",
    },
    resolver: zodResolver(updateOrderFormSchema),
  });

  const onSubmit = (values: UpdateOrderFormSchema) => console.log(values);

  const isUpdateOrderPending = false;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <EditOrderFormInner formId="update-order-form" onSubmit={onSubmit} />
        </Form>
      </CardContent>
      <CardFooter>
        <Button disabled={isUpdateOrderPending}>
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
