import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { CreateCustomerForm } from "../../forms/CreateCustomerForm";

export const CreateCustomerPage = () => {
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard - Pelanggan">
          <CreateCustomerForm />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

CreateCustomerPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
