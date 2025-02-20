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
import { DeleteProductDialog } from "../components/action";
import { ProductTableBodySkeleton } from "../components/skeleton/ProductTableSkeleton";
import type { ProductWithRelations } from "../types";

type ProductTableProps = {
  products?: ProductWithRelations[];
  isProductsLoading: boolean;
  refetchProducts: () => void;
};

export const ProductTable = ({
  products,
  isProductsLoading,
  refetchProducts,
}: ProductTableProps) => {
  return (
    <Table>
      <TableCaption>List data produk</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Kategori</TableHead>
          <TableHead className="w-[200px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      {isProductsLoading && <ProductTableBodySkeleton />}
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
              <TableCell className="capitalize">
                {product.category.name}
              </TableCell>
              <TableCell className="space-x-1">
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
          isLoading: isProductsLoading,
          fallback: (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Tidak ada data produk
              </TableCell>
            </TableRow>
          ),
        })}
      </TableBody>
    </Table>
  );
};
