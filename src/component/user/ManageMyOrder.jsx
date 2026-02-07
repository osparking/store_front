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
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center mt-3">
        <Col id="myOrderTable">
          <Card>
            <Card.Body>
              <div>
                <h2 className="mb-1 ps-0">
                  <strong>나의 주문 목록</strong>
                </h2>
                {showDetail ? (
                  <OrderDetail
                    detailId={detailId}
                    setShowDetail={setShowDetail}
                    isHouse={false}
                  />
                ) : (
                  <MyOrdersPage
                    setShowDetail={setShowDetail}
                    setDetailId={setDetailId}
                  />
                )}
              </div>
            </Card.Body>
            {showDetail && (
              <div className="d-flex justify-content-center align-items-center mt-3">
                <Button variant="success" onClick={() => setShowDetail(false)}>
                  주문 목록
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManageMyOrder;
