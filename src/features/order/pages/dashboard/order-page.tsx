import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { OrderTable } from "../../tables";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { api } from "@/utils/api";

export const OrderPage = () => {
  const {
    data: orders,
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
  } = api.order.getAll.useQuery({ params: { limit: 100 } });
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard Pemesanan">
          <header></header>
          <header className="mb-5">
            <Link href={"/dashboard/order/create"}>
              <Button>
                <CirclePlus />
                Buat Pesanan
              </Button>
            </Link>
          </header>
          <OrderTable
            orders={orders?.data}
            isOrdersLoading={isOrdersLoading}
            refetchOrders={refetchOrders}
          />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

OrderPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
