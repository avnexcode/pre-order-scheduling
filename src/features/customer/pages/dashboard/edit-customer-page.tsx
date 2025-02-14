import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { EditCustomerForm } from "../../forms";
import { useParams } from "next/navigation";

export const EditCustomerPage = () => {
  const params: { id: string } = useParams();
  const id = params?.id;
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard - Pelanggan">
          <EditCustomerForm customerId={id} />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

EditCustomerPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
