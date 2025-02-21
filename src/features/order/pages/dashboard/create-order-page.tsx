import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { CreateOrderForm } from "../../forms/CreateOrderForm";

export const CreateOrderPage = () => {
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="buat dulu dek">
          <CreateOrderForm />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

CreateOrderPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
