import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";

export const DashboardPage = () => {
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard">
          <h1>Hello Dashboard</h1>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

DashboardPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
