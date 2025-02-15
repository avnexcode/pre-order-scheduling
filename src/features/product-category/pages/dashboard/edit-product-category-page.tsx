import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { EditProductCategoryForm } from "../../forms";
import { useParams } from "next/navigation";

export const EditProductCategoryPage = () => {
  const params: { id: string } = useParams();
  const id = params?.id;
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Edit Kategori Produk">
          <EditProductCategoryForm productCategoryId={id} />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

EditProductCategoryPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
