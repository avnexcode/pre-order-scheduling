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
import type { TransactionStatus } from "@prisma/client";
import { ScanEye } from "lucide-react";
import Link from "next/link";
import { TransactionTableBodySkeleton } from "../components/skeleton/TransactionTableSkeleton";
import type { TransactionWithRelations } from "../types";

type TransactionTableProps = {
  transactions?: TransactionWithRelations[];
  isTransactionsLoading: boolean;
};

export const TransactionTable = ({
  transactions,
  isTransactionsLoading,
}: TransactionTableProps) => {
  const displayStatus = (status: TransactionStatus) => {
    return status === "PAID"
      ? "LUNAS"
      : status === "PARTIALLY_PAID"
        ? "DALAM CICILAN"
        : "BELUM DIBAYAR";
  };

  return (
    <Table>
      <TableCaption>Data transaksi</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Label Pesanan</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Dibayar</TableHead>
          <TableHead>Sisa</TableHead>
          <TableHead className="w-[150px]">Status</TableHead>
          <TableHead className="w-[100px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      {isTransactionsLoading && <TransactionTableBodySkeleton />}
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
              <TableCell className="capitalize">
                {displayStatus(transaction.status)}
              </TableCell>
              <TableCell className="w-[100px] space-x-1 whitespace-nowrap">
                <Link href={`/dashboard/transaction/${transaction.id}/detail`}>
                  <Button variant={"outline"} size={"sm"}>
                    <ScanEye />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ),
          isLoading: isTransactionsLoading,
          fallback: (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Tidak ada data transaksi
              </TableCell>
            </TableRow>
          ),
        })}
      </TableBody>
    </Table>
  );
};
