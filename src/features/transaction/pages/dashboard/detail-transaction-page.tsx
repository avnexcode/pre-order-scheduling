import {
  DashboardLayout,
  DashboardSection,
  PageContainer,
  SectionContainer,
} from "@/components/layouts";
import { PaymentRecordTable } from "@/features/payment-record/tables";
import { api } from "@/utils/api";
import { useParams } from "next/navigation";
import { TransactionCard } from "../../components/TransactionCard";
import type { TransactionWithRelations } from "../../types";
import { CreatePaymentRecordForm } from "@/features/payment-record/forms/CreatePaymentRecordForm";

export const DetailTransactionPage = () => {
  const params: { id: string } = useParams();
  const transactionId = params?.id;

  const {
    data: transaction,
    isLoading: isTransactionLoading,
    refetch: refetchTransaction,
  } = api.transaction.getById.useQuery(
    {
      id: transactionId,
    },
    {
      enabled: !!transactionId,
    },
  );
  return (
    <PageContainer>
      <SectionContainer padded>
        <DashboardSection
          title="Detail Transaksi"
          className="flex flex-col gap-10"
        >
          <TransactionCard
            transaction={transaction as TransactionWithRelations}
            isTransactionLoading={isTransactionLoading}
          />
          <div className="flex flex-col gap-10">
            <CreatePaymentRecordForm
              isLoading={isTransactionLoading}
              isAddPaymentDisabled={transaction?.status === "PAID"}
              transaction_id={transactionId}
              refetchTransaction={refetchTransaction}
            />
            <PaymentRecordTable
              refetchTransaction={refetchTransaction}
              paymentRecords={transaction?.payment_records}
              isPaymentRecordsLoading={isTransactionLoading}
            />
          </div>
        </DashboardSection>
      </SectionContainer>
    </PageContainer>
  );
};

DetailTransactionPage.getLayout = (page: React.ReactElement) => {
  return <DashboardLayout>{page}</DashboardLayout>;
};
