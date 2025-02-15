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
import type { Product } from "@prisma/client";
import { ScanEye, SquarePen } from "lucide-react";
import Link from "next/link";
import { DeleteProductDialog } from "../components/action";

type ProductTableProps = {
  products?: Product[];
  isProductsLoading: boolean;
  refetchProducts: () => void;
};

export const ProductTable = ({
  products,
  isProductsLoading,
  refetchProducts,
}: ProductTableProps) => {
  if (isProductsLoading) {
    return <></>;
  }
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Harga</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {renderElements({
          of: products,
          keyExtractor: (product) => product.id,
          render: (product, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">{product.name}</TableCell>
              <TableCell className="capitalize">
                {convertCurrency(product.price)}
              </TableCell>
              <TableCell className="space-x-1 text-right">
                <Link href={`/dashboard/product/${product.id}/detail`}>
                  <Button variant={"outline"} size={"sm"}>
                    <ScanEye />
                  </Button>
                </Link>
                <Link href={`/dashboard/product/${product.id}/edit`}>
                  <Button variant={"outline"} size={"sm"}>
                    <SquarePen />
                  </Button>
                </Link>
                <DeleteProductDialog
                  productId={product.id}
                  refetchProducts={refetchProducts}
                />
              </TableCell>
            </TableRow>
          ),
          fallback: (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Tidak ada data produk
              </TableCell>
            </TableRow>
          ),
        })}
      </TableBody>
    </Table>
  );
};
