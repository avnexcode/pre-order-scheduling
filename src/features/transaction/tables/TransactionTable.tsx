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
import { convertCurrency } from "@/utils/convert-currency";
import { renderElements } from "@/utils/render-elements";
import { ScanEye, SquarePen } from "lucide-react";
import Link from "next/link";
import { TransactionTableBodySkeleton } from "../components/skeleton/TransactionTableSkeleton";
import type { TransactionWithRelations } from "../types";

type TransactionTableProps = {
  transactions?: TransactionWithRelations[];
  isCategoriesLoading: boolean;
};

export const TransactionTable = ({
  transactions,
  isCategoriesLoading,
}: TransactionTableProps) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Label Pesanan</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Dibayar</TableHead>
          <TableHead>Sisa</TableHead>
        </TableRow>
      </TableHeader>
      {isCategoriesLoading && <TransactionTableBodySkeleton />}
      <TableBody>
        {renderElements({
          of: transactions,
          keyExtractor: (transaction) => transaction.id,
          render: (transaction, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">
                {transaction.order.label}
              </TableCell>
              <TableCell className="capitalize">
                {convertCurrency(transaction.total_amount)}
              </TableCell>
              <TableCell className="capitalize">
                {transaction.amount_paid
                  ? convertCurrency(transaction.amount_paid)
                  : "-"}
              </TableCell>
              <TableCell className="capitalize">
                {convertCurrency(transaction.amount_due ?? "")}
              </TableCell>
              <TableCell className="space-x-1 text-right">
                <Link href={`/dashboard/transaction/${transaction.id}/detail`}>
                  <Button variant={"outline"} size={"sm"}>
                    <ScanEye />
                  </Button>
                </Link>
                <Link href={`/dashboard/transaction/${transaction.id}/edit`}>
                  <Button variant={"outline"} size={"sm"}>
                    <SquarePen />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ),
          fallback: (
            <TableRow>
              <TableCell colSpan={2} className="text-center">
                Tidak ada data kategori
              </TableCell>
            </TableRow>
          ),
        })}
      </TableBody>
    </Table>
  );
};
