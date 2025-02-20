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
import { formatDate } from "@/utils/format-date";
import { renderElements } from "@/utils/render-elements";
import { type PaymentRecord } from "@prisma/client";
import { PaymentRecordTableBodySkeleton } from "../components/skeleton";
import { EditPaymentRecordForm } from "../forms/EditPaymentRecordForm";
import type { PaymentRecordWithRelations } from "../types";
import { DeletePaymentRecordDialog } from "../components/action";

type PaymentRecordTableProps = {
  paymentRecords?: PaymentRecord[] | PaymentRecordWithRelations[];
  isPaymentRecordsLoading: boolean;
  refetchTransaction: () => void;
};

export const PaymentRecordTable = ({
  paymentRecords,
  isPaymentRecordsLoading,
  refetchTransaction,
}: PaymentRecordTableProps) => {
  return (
    <Table>
      <TableCaption>Data riwayat pembayaran</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Jumlah Dibayar</TableHead>
          <TableHead className="w-[300px]">Tanggal Pembayaran</TableHead>
          <TableHead className="w-[100px]">Aksi</TableHead>
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
              <TableCell className="w-[300px] capitalize">
                {formatDate(paymentRecord.created_at)}
              </TableCell>
              <TableCell className="w-[100px] space-x-1 whitespace-nowrap">
                <EditPaymentRecordForm
                  paymentRecordId={paymentRecord.id}
                  refetchTransaction={refetchTransaction}
                />
                <DeletePaymentRecordDialog
                  paymentRecordId={paymentRecord.id}
                  refetchTransaction={refetchTransaction}
                />
              </TableCell>
            </TableRow>
          ),
          isLoading: isPaymentRecordsLoading,
          fallback: (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Tidak ada data kategori
              </TableCell>
            </TableRow>
          ),
        })}
      </TableBody>
    </Table>
  );
};
