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
import type { PaymentRecordWithRelations } from "../types";
import { PaymentRecordTableBodySkeleton } from "../components/skeleton";
import { convertCurrency } from "@/utils/convert-currency";
import { formatDate } from "@/utils/format-date";
import { type PaymentRecord } from "@prisma/client";

type PaymentRecordTableProps = {
  paymentRecords?: PaymentRecord[] | PaymentRecordWithRelations[];
  isPaymentRecordsLoading: boolean;
};

export const PaymentRecordTable = ({
  paymentRecords,
  isPaymentRecordsLoading,
}: PaymentRecordTableProps) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Jumlah Dibayar</TableHead>
          <TableHead>Tanggal Pembayaran</TableHead>
        </TableRow>
      </TableHeader>
      {isPaymentRecordsLoading && <PaymentRecordTableBodySkeleton />}
      <TableBody>
        {renderElements({
          of: paymentRecords,
          keyExtractor: (paymentRecord) => paymentRecord.id,
          render: (paymentRecord, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">
                {convertCurrency(paymentRecord.amount)}
              </TableCell>
              <TableCell className="capitalize">
                {formatDate(paymentRecord.created_at)}
              </TableCell>
              <TableCell className="space-x-1 text-right">
                <Link
                  href={`/dashboard/payment-record/${paymentRecord.id}/detail`}
                >
                  <Button variant={"outline"} size={"sm"}>
                    <ScanEye />
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/payment-record/${paymentRecord.id}/edit`}
                >
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
