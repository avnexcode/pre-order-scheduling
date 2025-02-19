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

export const CustomerTableSkeleton = () => {
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
        </TableRow>
      </TableHeader>
      <CustomerTableBodySkeleton />
    </Table>
  );
};

export const CustomerTableBodySkeleton = () => {
  return (
    <TableBody>
      {renderElements({
        of: [...new Array<undefined>(25)],
        keyExtractor: (_, index) => index,
        render: () => (
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
          </TableRow>
        ),
      })}
    </TableBody>
  );
};
