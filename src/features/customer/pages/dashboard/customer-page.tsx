import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { api } from "@/utils/api";
import { CustomerTable } from "../../tables";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

export const CustomerPage = () => {
  const {
    data: customers,
    isLoading: isCustomersLoading,
    refetch: refetchCustomers,
  } = api.customer.getAll.useQuery({
    limit: 10,
  });
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection title="Dashboard Pelanggan" className="gap-y-5">
          <header>
            <Link href={"/dashboard/customer/create"}>
              <Button>
                <CirclePlus />
                Tambahkan Pelanggan
              </Button>
            </Link>
          </header>
          <main>
            <CustomerTable
              customers={customers?.items}
              isCustomersLoading={isCustomersLoading}
              refetchCustomers={refetchCustomers}
            />
          </main>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

CustomerPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
