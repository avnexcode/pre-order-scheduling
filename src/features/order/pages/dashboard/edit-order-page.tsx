import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";

export const EditOrderPage = () => {
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Edit Order Dek">
          <h1>KONTOL Edit</h1>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

EditOrderPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
