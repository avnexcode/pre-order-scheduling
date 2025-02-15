import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";

export const DetailProductPage = () => {
  return (
    <PageContainer>
      <SectionContainer>
        <DashboardSection title="Detail Produk">
          <h1>AH</h1>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

DetailProductPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
