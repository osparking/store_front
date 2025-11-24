import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { getOrderDetail } from "../../buy/orderService";
import { formatDate } from "../../util/utilities";
import "./OrderDetail.css";

const OrderDetail = ({ detailId, setShowDetail }) => {
  const [orderDetails, setOrderDetails] = useState(undefined);

  useEffect(() => {
    const readOrderDetail = async () => {
      const response = await getOrderDetail(detailId);
      setOrderDetails(response);
      console.log("Response: ", JSON.stringify(response));
    };
    readOrderDetail();
  }, []);

  return (
    <>
      {orderDetails && (
        <div>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12} md={4}>
              <Table className="tabWidth">
                <tbody>
                  <tr>
                    <th className="iLabel">주문ID</th>
                    <td className="oText">{orderDetails.order.orderId}</td>
                  </tr>
                  <tr>
                    <th className="iLabel">주문명칭</th>
                    <td className="oText">{orderDetails.order.orderName}</td>
                  </tr>
                  <tr>
                    <th className="iLabel">주문시간</th>
                    <td className="oText">
                      {formatDate(orderDetails.order.orderTime)}
                    </td>
                  </tr>
                  <tr>
                    <th className="iLabel">주문상태</th>
                    <td className="oText">{orderDetails.order.orderStatus}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col xs={12} md={4}>
              <Table className="tabWidth">
                <tbody>
                  <tr>
                    <th className="iLabel">주문자명</th>
                    <td className="oText">{orderDetails.order.customer}</td>
                  </tr>
                  <tr>
                    <th className="iLabel">주문자ID</th>
                    <td className="oText">{orderDetails.order.user_id}</td>
                  </tr>
                  <tr>
                    <th className="iLabel">지불금액</th>
                    <td className="oText">
                      {Number(orderDetails.order.payment).toLocaleString()}원
                    </td>
                  </tr>
                  <tr>
                    <th className="iLabel">수령자명</th>
                    <td className="oText">{orderDetails.order.recipient}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12} md={3}>
              <h6>외형별 개수</h6>
              <Table>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr key={index}>
                      <th className="aLabel">{item.shape}</th>
                      <td> {item.count} 개</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col xs={12} md={5}>
              <Table className="tabWidth">
                <tbody>
                  <tr>
                    <th className="aLabel">우편번호</th>
                    <td className="oText">{orderDetails.order.customer}</td>
                  </tr>
                  <tr>
                    <th className="aLabel">도로주소</th>
                    <td className="oText">{orderDetails.order.roadAddress}</td>
                  </tr>
                  <tr>
                    <th className="aLabel">상세주소</th>
                    <td className="oText">
                      {Number(orderDetails.order.payment).toLocaleString()}원
                    </td>
                  </tr>
                  <tr>
                    <th className="aLabel">휴대폰</th>
                    <td className="oText">{orderDetails.order.recipient}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      )}
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Button variant="success" onClick={() => setShowDetail(false)}>
          주문 목록
        </Button>
      </div>
    </>
  );
};

export default OrderDetail;
