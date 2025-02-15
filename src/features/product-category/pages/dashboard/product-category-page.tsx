import {
  DashboardLayout,
  DashboardProductSection,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { ProductCategoryTable } from "../../tables";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { api } from "@/utils/api";

export const ProductCategoryPage = () => {
  const {
    data: productCategories,
    isLoading: isProductCategoriesLoading,
    refetch: refetchProductCategories,
  } = api.productCategory.getAll.useQuery({
    limit: 100,
  });

  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard Kategori Produk">
          <DashboardProductSection>
            <header className="mb-5">
              <Link href={"/dashboard/product-category/create"}>
                <Button>
                  <CirclePlus />
                  Tambahkan Kategori Produk
                </Button>
              </Link>
            </header>
            <ProductCategoryTable
              productCategories={productCategories?.items}
              isProductCategoriesLoading={isProductCategoriesLoading}
              refetchProductCategories={refetchProductCategories}
            />
          </DashboardProductSection>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

ProductCategoryPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
