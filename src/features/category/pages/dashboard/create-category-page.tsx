import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { CreateCategoryForm } from "../../forms";

export const CreateCategoryPage = () => {
  return (
    <PageContainer>
      <SectionContainer>
        <DashboardSection title="Buat Kategori Produk">
          <CreateCategoryForm />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

CreateCategoryPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
