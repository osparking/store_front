import { useState } from "react";
import { Button, Card } from "react-bootstrap";
import "../../App.css";
import MyOrdersPage from "../pay_toss/MyOrdersPage";
import OrderDetailEdit from "../worker/order/OrderDetailEdit";
import "./ManageMyOrder.css";

const ManageMyOrder = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <div
      className="justify-content-center align-items-center my-card-container"
      style={{ display: "flex", width: "100%" }}
    >
      <Card className="tableCard">
        <Card.Body style={{ width: "100%" }}>
          <h2 className="mb-1 ps-0">
            <strong>{showDetail ? "주문 상세" : "나의 주문"}</strong>
          </h2>
          {showDetail ? (
            <>
              <OrderDetailEdit detailId={detailId} />
              <div className="d-flex justify-content-center align-items-center char4button">
                <Button
                  variant="success"
                  className="showAlways mt-3 p-0"
                  onClick={() => setShowDetail(false)}
                  style={{ margin: "0 0 1em" }}
                >
                  주문 목록
                </Button>
              </div>
            </>
          ) : (
            <MyOrdersPage
              setShowDetail={setShowDetail}
              setDetailId={setDetailId}
            />
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManageMyOrder;
