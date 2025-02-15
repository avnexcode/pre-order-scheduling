import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { CreateProductForm } from "../../forms";

export const CreateProductPage = () => {
  return (
    <PageContainer>
      <SectionContainer>
        <DashboardSection title="Buat Produk">
          <CreateProductForm />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

CreateProductPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
