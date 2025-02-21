import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { renderElements } from "@/utils/render-elements";
import { ScanEye, SquarePen } from "lucide-react";
import Link from "next/link";
import { DeleteOrderDialog } from "../components/action/DeleteOrderDialog";
import { OrderTableBodySkeleton } from "../components/skeleton/OrderTableSkeleton";
import type { OrderWithRelations } from "../types";
import { convertCurrency } from "@/utils/convert-currency";

type OrderTableProps = {
  orders?: OrderWithRelations[];
  isOrdersLoading: boolean;
  refetchOrders: () => void;
};

export const OrderTable = ({
  orders,
  isOrdersLoading,
  refetchOrders,
}: OrderTableProps) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Label</TableHead>
          <TableHead>Pelanggan</TableHead>
          <TableHead>Produk</TableHead>
          <TableHead className="w-[150px]">Total Pesanan</TableHead>
          <TableHead>Total Harga</TableHead>
          <TableHead className="w-[200px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      {isOrdersLoading && <OrderTableBodySkeleton />}
      <TableBody>
        {renderElements({
          of: orders,
          keyExtractor: (order) => order.id,
          render: (order, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">{order.label}</TableCell>
              <TableCell className="capitalize">
                {order.customer.name}
              </TableCell>
              <TableCell className="capitalize">{order.product.name}</TableCell>
              <TableCell className="capitalize">{order.total}</TableCell>
              <TableCell className="capitalize">
                {convertCurrency(order.transaction?.total_amount ?? "")}
              </TableCell>
              <TableCell className="space-x-1">
                <Link href={`/dashboard/order/${order.id}/detail`}>
                  <Button variant={"outline"} size={"sm"}>
                    <ScanEye />
                  </Button>
                </Link>
                <Link href={`/dashboard/order/${order.id}/edit`}>
                  <Button variant={"outline"} size={"sm"}>
                    <SquarePen />
                  </Button>
                </Link>
                <DeleteOrderDialog
                  orderId={order.id}
                  refetchOrders={refetchOrders}
                />
              </TableCell>
            </TableRow>
          ),
          isLoading: isOrdersLoading,
          fallback: (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Tidak ada data pesanan
              </TableCell>
            </TableRow>
          ),
        })}
      </TableBody>
    </Table>
  );
};
