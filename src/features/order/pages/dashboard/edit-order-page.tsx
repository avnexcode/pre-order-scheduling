import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { EditOrderForm } from "../../forms/EditOrderForm";
import { useParams } from "next/navigation";

export const EditOrderPage = () => {
  const params: { id: string } = useParams();
  const orderId = params?.id;
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Edit Order Dek">
          <EditOrderForm orderId={orderId} />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

EditOrderPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
