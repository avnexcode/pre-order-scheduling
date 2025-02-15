import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { useParams } from "next/navigation";
import { EditProductForm } from "../../forms";

export const EditProductPage = () => {
  const params: { id: string } = useParams();
  const id = params?.id;

  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Edit Produk">
          <EditProductForm productId={id} />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

EditProductPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
