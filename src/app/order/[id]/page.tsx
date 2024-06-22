import { FC } from "react";

interface OrderPageProps {
  params: { id: string };
}

const OrderPage: FC<OrderPageProps> = async ({ params }) => {
  const { id } = params;
  return (
    <>
      <h1>Kitobni ijaraga ol!</h1>
    </>
  );
};
export default OrderPage;
