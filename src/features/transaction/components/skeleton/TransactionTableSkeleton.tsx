import { Skeleton } from "@/components/ui/skeleton";
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

export const TransactionTableSkeleton = () => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">
            <Skeleton className="h-3 w-full" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-3 w-full" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-3 w-full" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-3 w-full" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-3 w-full" />
          </TableHead>
          <TableHead className="w-[150px]">
            <Skeleton className="h-3 w-full" />
          </TableHead>
          <TableHead className="w-[100px]">
            <Skeleton className="h-3 w-full" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TransactionTableBodySkeleton />
    </Table>
  );
};

export const TransactionTableBodySkeleton = () => {
  return (
    <TableBody>
      {renderElements({
        of: [...new Array<undefined>(10)],
        keyExtractor: (_, index) => index,
        render: () => <TransactionTableItemSkeleton />,
      })}
    </TableBody>
  );
};

export const TransactionTableItemSkeleton = () => {
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
      <TableCell>
        <Skeleton className="h-3 w-full" />
      </TableCell>
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
