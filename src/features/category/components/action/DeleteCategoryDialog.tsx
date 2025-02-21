import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { Trash } from "lucide-react";
import { toast } from "sonner";

type DeleteCategoryDialogProps = {
  CategoryId: string;
  refetchCategories: () => void;
};

export const DeleteCategoryDialog = ({
  CategoryId,
  refetchCategories,
}: DeleteCategoryDialogProps) => {
  const { mutate: deleteCategory } = api.category.delete.useMutation({
    onSuccess: () => {
      toast.success("Berhasil menghapus data kategori");
      refetchCategories();
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size={"sm"}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah kamu sudah yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => deleteCategory({ id: CategoryId })}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
