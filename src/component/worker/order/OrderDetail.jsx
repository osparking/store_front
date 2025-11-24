import { Button, Table } from "react-bootstrap";
import { getOrderDetail } from "../../buy/orderService";
import { useEffect, useState } from "react";

const OrderDetail = ({ detailId, setShowDetail }) => {
  const [orderDetails, setOrderDetails] = useState({});
  
  useEffect(() => {
    const readOrderDetail = async () => {
      const response = await getOrderDetail(detailId);
      setOrderDetails(response);
      console.log("Response: ", JSON.stringify(response));
    }
    readOrderDetail();
  }
  , []);

  return (
    <>
      <div>Detail for order ID : {detailId}</div>
      <Button variant="success" onClick={() => setShowDetail(false)}>
        주문 목록
      </Button>
    </>
  );
};

export default OrderDetail;
