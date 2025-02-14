import { Heading } from "@/components/ui/heading";
import { api } from "@/utils/api";

type CustomerCardProps = {
  customerId: string;
};

export const CustomerCard = ({ customerId }: CustomerCardProps) => {
  const { data: customer, isLoading: isCustomerLoading } =
    api.customer.getById.useQuery(
      { id: customerId },
      { enabled: !!customerId },
    );

  if (isCustomerLoading) {
    return <h1>Loading...</h1>;
  }

  if (!customer) {
    return <h1>Tidak ada data customer</h1>;
  }

  return (
    <>
      <Heading>Hello {customer.name}</Heading>
    </>
  );
};
