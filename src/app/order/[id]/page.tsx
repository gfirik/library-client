import { FC } from "react";

interface OrderPageProps {
  params: {
    id: string;
  };
}

const OrderPage: FC<OrderPageProps> = ({ params }) => {
  const { id } = params;
  return <div>hello</div>;
};
export default OrderPage;
