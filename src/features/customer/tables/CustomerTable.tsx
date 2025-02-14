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
import { type Customer } from "@prisma/client";
import Link from "next/link";
import { DeleteCustomerDialog } from "../components/action/DeleteCustomerDialog";
import { CustomerTableSkeleton } from "../components/skeleton/CustomerTableSkeleton";
import { Button } from "@/components/ui/button";
import { ScanEye, SquarePen } from "lucide-react";

type CustomerTableProps = {
  customers?: Customer[];
  isCustomersLoading: boolean;
  refetchCustomers: () => void;
};

export const CustomerTable = ({
  customers = [],
  isCustomersLoading,
  refetchCustomers,
}: CustomerTableProps) => {
  if (isCustomersLoading) {
    return <CustomerTableSkeleton />;
  }
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>No Handphone</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {renderElements({
          of: customers,
          keyExtractor: (customer) => customer.id,
          render: (customer, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.email ?? "-"}</TableCell>
              <TableCell className="space-x-1 text-right">
                <Link href={`/dashboard/customer/${customer.id}/detail`}>
                  <Button variant={"outline"} size={"sm"}>
                    <ScanEye />
                  </Button>
                </Link>
                <Link href={`/dashboard/customer/${customer.id}/edit`}>
                  <Button variant={"outline"} size={"sm"}>
                    <SquarePen />
                  </Button>
                </Link>
                <DeleteCustomerDialog
                  customerId={customer.id}
                  refetchCustomers={refetchCustomers}
                />
              </TableCell>
            </TableRow>
          ),
          fallback: (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Tidak ada data pelanggan
              </TableCell>
            </TableRow>
          ),
        })}
      </TableBody>
    </Table>
  );
};
