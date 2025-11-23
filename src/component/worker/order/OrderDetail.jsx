import { Button } from "react-bootstrap";

const OrderDetail = ({ detailId, setShowDetail }) => {
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
