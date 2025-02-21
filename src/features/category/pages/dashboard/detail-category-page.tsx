import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";

export const DetailCategoryPage = () => {
  return (
    <PageContainer>
      <SectionContainer>
        <DashboardSection title="Detail Kategori Produk">
          <h1>AH</h1>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

DetailCategoryPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
