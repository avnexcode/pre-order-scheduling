import {
  DashboardLayout,
  DashboardProductSection,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { CategoryTable } from "../../tables";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { api } from "@/utils/api";

export const CategoryPage = () => {
  const {
    data: Categories,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = api.category.getAll.useQuery({
    limit: 100,
  });

  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard Kategori Produk">
          <DashboardProductSection>
            <header className="mb-5">
              <Link href={"/dashboard/category/create"}>
                <Button>
                  <CirclePlus />
                  Tambahkan Kategori Produk
                </Button>
              </Link>
            </header>
            <CategoryTable
              categories={Categories?.items}
              isCategoriesLoading={isCategoriesLoading}
              refetchCategories={refetchCategories}
            />
          </DashboardProductSection>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

CategoryPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
