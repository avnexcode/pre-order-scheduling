import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { CreateProductCategoryForm } from "../../forms";

export const CreateProductCategoryPage = () => {
  return (
    <PageContainer>
      <SectionContainer>
        <DashboardSection title="Buat Kategori Produk">
          <CreateProductCategoryForm />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

CreateProductCategoryPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
