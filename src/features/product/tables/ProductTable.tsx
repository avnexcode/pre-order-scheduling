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
import { ScanEye, SquarePen } from "lucide-react";
import Link from "next/link";

type ProductTableProps = {
  productId: string;
};

export const ProductTable = ({ productId }: ProductTableProps) => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead className="w-full">Nama</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">1</TableCell>
          <TableCell>Kontol</TableCell>
          <TableCell className="flex items-center gap-2"></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
