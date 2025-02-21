import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { TransactionTable } from "../../tables/TransactionTable";
import { api } from "@/utils/api";
import type { TransactionWithRelations } from "../../types";

export const TransactionPage = () => {
  const { data: transactions, isLoading: isTransactionsLoading } =
    api.transaction.getAll.useQuery({
      params: {
        limit: 100,
      },
    });
  return (
    <PageContainer>
      <SectionContainer>
        <DashboardSection title="Dashboard Transaksi">
          <TransactionTable
            transactions={transactions?.data as TransactionWithRelations[]}
            isTransactionsLoading={isTransactionsLoading}
          />
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

TransactionPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
