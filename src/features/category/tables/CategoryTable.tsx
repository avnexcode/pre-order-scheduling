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
import type { Category } from "@prisma/client";
import { ScanEye, SquarePen } from "lucide-react";
import Link from "next/link";
import { DeleteCategoryDialog } from "../components/action";
import { CategoryTableBodySkeleton } from "../components/skeleton/CategoryTableSkeleton";

type CategoryTableProps = {
  categories?: Category[];
  isCategoriesLoading: boolean;
  refetchCategories: () => void;
};

export const CategoryTable = ({
  categories,
  isCategoriesLoading,
  refetchCategories,
}: CategoryTableProps) => {
  return (
    <Table>
      <TableCaption>List data kategori</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">No</TableHead>
          <TableHead>Nama</TableHead>
          <TableHead className="w-[200px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      {isCategoriesLoading && <CategoryTableBodySkeleton />}
      <TableBody>
        {renderElements({
          of: categories,
          keyExtractor: (category) => category.id,
          render: (category, index) => (
            <TableRow>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">{category.name}</TableCell>
              <TableCell className="space-x-1">
                <Link href={`/dashboard/category/${category.id}/detail`}>
                  <Button variant={"outline"} size={"sm"}>
                    <ScanEye />
                  </Button>
                </Link>
                <Link href={`/dashboard/category/${category.id}/edit`}>
                  <Button variant={"outline"} size={"sm"}>
                    <SquarePen />
                  </Button>
                </Link>
                <DeleteCategoryDialog
                  CategoryId={category.id}
                  refetchCategories={refetchCategories}
                />
              </TableCell>
            </TableRow>
          ),
          isLoading: isCategoriesLoading,
          fallback: (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Tidak ada data kategori
              </TableCell>
            </TableRow>
          ),
        })}
      </TableBody>
    </Table>
  );
};
