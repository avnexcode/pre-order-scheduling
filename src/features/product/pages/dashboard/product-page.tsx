import {
  DashboardLayout,
  DashboardProductSection,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { ProductTable } from "../../tables";
import { api } from "@/utils/api";

export const ProductPage = () => {
  const {
    data: products,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = api.product.getAll.useQuery({
    params: {
      limit: 100,
    },
  });
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard Produk">
          <DashboardProductSection>
            <header className="mb-5">
              <Link href={"/dashboard/product/create"}>
                <Button>
                  <CirclePlus />
                  Tambahkan Produk
                </Button>
              </Link>
            </header>
            <ProductTable
              products={products?.data}
              isProductsLoading={isProductsLoading}
              refetchProducts={refetchProducts}
            />
          </DashboardProductSection>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

ProductPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
