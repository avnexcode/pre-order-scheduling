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
import type { ProductCategory } from "@prisma/client";
import { ScanEye, SquarePen } from "lucide-react";
import Link from "next/link";
import { DeleteProductCategoryDialog } from "../components/action/";

type ProductCategoryTableProps = {
  productCategories?: ProductCategory[];
  isProductCategoriesLoading: boolean;
  refetchProductCategories: () => void;
};

export const ProductCategoryTable = ({
  productCategories,
  isProductCategoriesLoading,
  refetchProductCategories,
}: ProductCategoryTableProps) => {
  if (isProductCategoriesLoading) {
    return <></>;
  }
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Nama</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {renderElements({
          of: productCategories,
          keyExtractor: (productCategory) => productCategory.id,
          render: (productCategory, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">
                {productCategory.name}
              </TableCell>
              <TableCell className="space-x-1 text-right">
                <Link
                  href={`/dashboard/product-category/${productCategory.id}/detail`}
                >
                  <Button variant={"outline"} size={"sm"}>
                    <ScanEye />
                  </Button>
                </Link>
                <Link
                  href={`/dashboard/product-category/${productCategory.id}/edit`}
                >
                  <Button variant={"outline"} size={"sm"}>
                    <SquarePen />
                  </Button>
                </Link>
                <DeleteProductCategoryDialog
                  productCategoryId={productCategory.id}
                  refetchProductCategories={refetchProductCategories}
                />
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
