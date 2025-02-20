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
    data: categories,
    isLoading: isCategoriesLoading,
    refetch: refetchCategories,
  } = api.category.getAll.useQuery({
    params: {
      limit: 100,
    },
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
                  Tambahkan Kategori
                </Button>
              </Link>
            </header>
            <CategoryTable
              categories={categories?.data}
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
