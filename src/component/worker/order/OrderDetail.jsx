import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import {
  changeOrderStatus,
  getOrderDetail,
  patchOrderReview,
} from "../../buy/orderService";
import ConfirmationModal from "../../modal/ConfirmationModal";
import ReviewModal from "../../modal/ReviewModal";
import { formatDate } from "../../util/utilities";
import "./OrderDetail.css";

const OrderDetail = ({ detailId, setShowDetail, isHouse }) => {
  const [orderDetails, setOrderDetails] = useState(undefined);
  const [orderStatus, setOrderStatus] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const readOrderDetail = async () => {
    const response = await getOrderDetail(detailId);
    setOrderDetails(response);
    setOrderStatus(response.order.orderStatus);
    console.log("Response: ", JSON.stringify(response));
  };

  useEffect(() => {
    readOrderDetail();
  }, []);

  const getStatusLabel = () => {
    if (orderDetails.order.orderStatus !== "GS25 접수") {
      return "주문 상태";
    } else {
      return "배송 상태";
    }
  };

  const notAtGS25yet = () => {
    return (
      orderDetails.order.orderStatus === "결제대기" ||
      orderDetails.order.orderStatus === "결제완료" ||
      orderDetails.order.orderStatus === "발주확인"
    );
  };

  const [showTooltip1, setShowTooltip1] = useState(false);
  const [showTooltip2, setShowTooltip2] = useState(false);
  const cjlogistics = "https://trace.cjlogistics.com/next/tracking.html?wblNo";

  const button2pushed = () => {
    switch (orderStatus) {
      case "구매 확정":
      case "후기 남김":
        setShowReviewModal(true);
        break;
      default:
        setShowModal(true);
        break;
    }
  };

  const handleConfirm = async () => {
    setShowModal(false);
    let nextStatus = undefined;

    switch (orderDetails.order.orderStatus) {
      case "GS25 접수":
        nextStatus = "수취 확인";
        break;
      case "수취 확인":
        nextStatus = "구매 확정";
        break;
      default:
        break;
    }

    if (nextStatus) {
      const data = { id: orderDetails.order.id, status: nextStatus };
      await changeOrderStatus(data);
      setOrderStatus(nextStatus);
    }
  };

  const saveReview = async (reviewData) => {
    setShowReviewModal(false);
    let nextStatus = "후기 남김";
    await patchOrderReview(reviewData);
    setOrderStatus(nextStatus);
    readOrderDetail();
  };

  const getBodyMessage = (status) => {
    if (!orderDetails) return;

    const orderName = orderDetails.order.orderName;
    let msg = undefined;

    switch (status) {
      case "GS25 접수":
        msg = "'" + orderName + "' 상품을 받으셨습니까?";
        break;
      case "수취 확인":
        msg = "'" + orderName + "' 구매를 확정하겠습니까?";
        break;
      case "구매 확정":
        msg = "'" + orderName + "' 구매 후기를 작성하겠습니까?";
        break;
      case "후기 남김":
        msg = "'" + orderName + "' 구매 후기를 수정하겠습니까?";
        break;
      default:
        msg = "'" + orderName + "' 관련 확인!";
        break;
    }
    return msg;
  };

  const getBottomButtonLabel = (status) => {
    let label = undefined;
    switch (status) {
      case "수취 확인":
        label = "구매 확정";
        break;
      case "구매 확정":
        label = "후기 작성";
        break;
      case "후기 남김":
        if (isHouse) {
          label = "후기 읽기";
        } else {
          label = "후기 관리";
        }
        break;
      case "GS25 접수":
        if (isHouse) {
          label = "배송 조회";
        } else {
          label = "수취 확인";
        }
        break;
      default:
        label = "수취 확인";
        break;
    }
    return label;
  };

  const getModalTitle = (status) => {
    let title = undefined;
    switch (status) {
      case "수취 확인":
        title = "상품 구매 확정";
        break;
      case "구매 확정":
        title = "퀼(Quill) - 리치(rich) 문서 편집기";
        break;
      case "후기 남김":
        title = "후기 관리";
        break;
      default:
        title = "상품 수취 확인";
        break;
    }
    return title;
  };

  const getNoLabel = (status) => {
    let noLabel = undefined;
    switch (status) {
      case "수취 확인":
        noLabel = "확정 보류";
        break;
      case "후기 남김":
        noLabel = "그냥둘께요";
        break;
      default:
        noLabel = "아니오";
        break;
    }
    return noLabel;
  };

  const getYesLabel = (status) => {
    let yesLabel = undefined;
    switch (status) {
      case "수취 확인":
        yesLabel = "구매 확정";
        break;
      case "구매 확정":
        yesLabel = "작성 시작";
        break;
      case "후기 남김":
        yesLabel = "수정 적용";
        break;
      default:
        yesLabel = "받았어요";
        break;
    }
    return yesLabel;
  };

  const handleTopButton = () => {
    if (isHouse) {
      setShowReviewModal(true);
    } else {
      const url = `${cjlogistics}=${orderDetails.order.waybillNo}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirm}
        bodyMessage={getBodyMessage(orderStatus)}
        title={getModalTitle(orderStatus)}
        noLabel={getNoLabel(orderStatus)}
        yesLabel={getYesLabel(orderStatus)}
      />
      <ReviewModal
        show={showReviewModal}
        handleClose={() => setShowReviewModal(false)}
        title={getModalTitle(orderStatus)}
        order={orderDetails?.order}
        saveReview={saveReview}
        editable={!isHouse}
      />

      {orderDetails && (
        <div className="box_section orders_table_div darkBack">
          <Row className="d-flex justify-content-center align-items-center">
            <p className="shapeCount darkFont">주문 개요</p>
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
                    <td className="oText">{orderStatus}</td>
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
                  {isHouse && (
                    <tr>
                      <th className="iLabel">주문자ID</th>
                      <td className="oText">{orderDetails.order.user_id}</td>
                    </tr>
                  )}
                  <tr>
                    <th className="iLabel">지불금액</th>
                    <td className="oText">
                      {Number(orderDetails.order.payment).toLocaleString()}원
                    </td>
                  </tr>
                  {!isHouse && (
                    <tr>
                      <td
                        className="oText hidden centered"
                        colSpan={2}
                        onMouseEnter={() =>
                          notAtGS25yet() && setShowTooltip1(true)
                        }
                        onMouseLeave={() => setShowTooltip1(false)}
                      >
                        <Button
                          className="pt-0 pb-0"
                          disabled={notAtGS25yet()}
                          onClick={() => handleTopButton()}
                        >
                          배송 조회
                        </Button>
                        {showTooltip1 && (
                          <div
                            className="absolute bottom-full left-1/2 
                            transform -translate-x-1/2 mb-1 px-2 py-1 
                            bg-black text-white text-xs rounded"
                          >
                            'GS25 접수' 후 활성화됨
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td
                      className="oText hidden centered"
                      colSpan={2}
                      onMouseEnter={() =>
                        notAtGS25yet() && setShowTooltip2(true)
                      }
                      onMouseLeave={() => setShowTooltip2(false)}
                    >
                      <Button
                        className="pt-0 pb-0"
                        disabled={notAtGS25yet()}
                        onClick={() => button2pushed()}
                      >
                        {getBottomButtonLabel(orderStatus)}
                      </Button>
                      {showTooltip2 && (
                        <div
                          className="absolute bottom-full left-1/2 
                          transform -translate-x-1/2 mb-1 px-2 py-1 
                          bg-black text-white text-xs rounded"
                        >
                          'GS25 접수' 후 활성화됨
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center align-items-center">
            <Col xs={12} md={2}>
              <p className="shapeCount darkFont">외형별 개수</p>
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
            <Col xs={12} md={8}>
              <p className="shapeCount darkFont">배송지</p>
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
