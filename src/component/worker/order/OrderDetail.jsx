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

  const getStatusLabel = () => {
    if (orderDetails.order.orderStatus !== "GS25 접수") {
      return "주문 상태";
    } else {
      return "배송 상태";
    }
  };

  const enableButton = () => {
    return orderDetails.order.orderStatus !== "GS25 접수";
  };
  const cjlogistics = "https://trace.cjlogistics.com/next/tracking.html?wblNo";

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
                    <th className="iLabel">{getStatusLabel()}</th>
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
                    <td
                      className="oText hidden centered"
                      colSpan={2}
                    >
                      <Button
                        className="pt-0 pb-0"
                        href={`${cjlogistics}=363131774074`}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={enableButton()}
                      >
                        배송 조회
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12} md={2}>
              <p className="shapeCount">외형별 개수</p>
              <Table style={{ marginTop: 0 }}>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr key={index}>
                      <th className="aLabel">{item.shape}</th>
                      <td> {item.count} 개</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: "bold" }}>
                    <th className="aLabel bold center">합 계</th>
                    <td> {orderDetails.totalSoapCount} 개</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col xs={12} md={6}>
              <p className="shapeCount">배송지</p>
              <Table className="tabWidth" style={{ marginTop: 0 }}>
                <tbody>
                  <tr>
                    <th className="aLabel">우편번호</th>
                    <td className="oText">{orderDetails.order.zipcode}</td>
                  </tr>
                  <tr>
                    <th className="aLabel">도로주소</th>
                    <td className="oText">{orderDetails.order.roadAddress}</td>
                  </tr>
                  <tr>
                    <th className="aLabel">상세주소</th>
                    <td className="oText">
                      {orderDetails.order.addressDetail}
                    </td>
                  </tr>
                  <tr>
                    <th className="aLabel">받는 분</th>
                    <td className="oText">{orderDetails.order.recipient}</td>
                  </tr>
                  <tr>
                    <th className="aLabel">휴대폰</th>
                    <td className="oText">{orderDetails.order.mbPhone}</td>
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
