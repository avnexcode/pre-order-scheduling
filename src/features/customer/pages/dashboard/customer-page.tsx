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
import { CustomerPagination } from "../../components/CustomerPagination";

export const CustomerPage = () => {
  const {
    data: customers,
    isLoading: isCustomersLoading,
    refetch: refetchCustomers,
  } = api.customer.getAll.useQuery({
    params: {
      limit: 100,
    },
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
              customers={customers?.data}
              isCustomersLoading={isCustomersLoading}
              refetchCustomers={refetchCustomers}
            />
            <CustomerPagination />
          </main>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

CustomerPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
