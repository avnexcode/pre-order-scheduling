import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { useParams } from "next/navigation";
import { CustomerCard } from "../../components";

export const DetailCustomerPage = () => {
  const params: { id: string } = useParams();
  const id = params?.id;
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard - Pelanggan">
          Detail KONTOL id: {id}
          <CustomerCard customerId={id} />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

DetailCustomerPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
