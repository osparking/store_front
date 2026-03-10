import { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import "../../App.css";
import MyOrdersPage from "../pay_toss/MyOrdersPage";
import OrderDetail from "../worker/order/OrderDetail";
import "./ManageMyOrder.css";

const ManageMyOrder = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <div
      className="justify-content-center align-items-center"
      style={{ display: "flex", overflow: "auto", width: "100vw" }}
    >
      <Card style={{ margin: "28px 0" }}>
        <Card.Body style={{ width: "100%" }}>
          <h2 className="mb-1 ps-0">
            <strong>{showDetail ? "주문 상세" : "나의 주문 목록"}</strong>
          </h2>
          {showDetail ? (
            <OrderDetail detailId={detailId} isHouse={false} />
          ) : (
            <MyOrdersPage
              setShowDetail={setShowDetail}
              setDetailId={setDetailId}
            />
          )}
        </Card.Body>
        {showDetail && (
          <div className="d-flex justify-content-center align-items-center">
            <Button
              variant="success"
              className="showAlways"
              onClick={() => setShowDetail(false)}
              style={{ margin: "0 0 1em" }}
            >
              주문 목록
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ManageMyOrder;
