import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";

export const DetailOrderPage = () => {
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="">
          <h1></h1>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

DetailOrderPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
