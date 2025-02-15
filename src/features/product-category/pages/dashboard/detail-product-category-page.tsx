import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";

export const DetailProductCategoryPage = () => {
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

DetailProductCategoryPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
