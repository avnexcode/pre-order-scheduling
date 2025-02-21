import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { EditCategoryForm } from "../../forms";
import { useParams } from "next/navigation";

export const EditCategoryPage = () => {
  const params: { id: string } = useParams();
  const id = params?.id;
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Edit Kategori Produk">
          <EditCategoryForm CategoryId={id} />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

EditCategoryPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
