import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { renderElements } from "@/utils/render-elements";

export const CategoryTableSkeleton = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Skeleton className="h-3 w-full" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-3 w-full" />
          </TableHead>
          <TableHead className="w-[200px]">
            <Skeleton className="h-3 w-full" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <CategoryTableBodySkeleton />
    </Table>
  );
};

export const CategoryTableBodySkeleton = () => {
  return (
    <TableBody>
      {renderElements({
        of: [...new Array<undefined>(10)],
        keyExtractor: (_, index) => index,
        render: () => <CategoryTableItemSkeleton />,
      })}
    </TableBody>
  );
};

export const CategoryTableItemSkeleton = () => {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-3 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-full" />
      </TableCell>
    </TableRow>
  );
};
