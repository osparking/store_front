import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import OrderDigest from "../buy/OrderDigest";
import { saveOrderRecipient } from "../buy/orderService";
import { callWithToken } from "../util/api";
import { getSuffixAfterSpace } from "../util/utilities";
import "./WidgetCheckoutPage.css";

// 전자결제 신청 및 가입 완료 후, clientKey 를 다음으로 수정할 것.
// 개발자센터의 결제위젯 연동 키 > 클라이언트 키
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

function WidgetCheckoutPage() {
  const location = useLocation();
  const {
    orderData,
    feeData,
    formItems,
    subTotal,
    source,
    toDefaultRecipient,
    isDefaultRecipient,
  } = location.state;

  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false);
  const [orderId, setOrderId] = useState("");
  const isSubmittingRef = useRef(false);

  async function saveOrderRecord() {
    let action = "";
    if (toDefaultRecipient) {
      if (!isDefaultRecipient) action = "remove";
    } else if (isDefaultRecipient) {
      action = "store";
    }

    const orderAction = { ...orderData, defaultRecipientAction: action };

    // 로컬에 저장된 주문 정보를 찾는다.
    const localOrder = localStorage.getItem("ORDER_ACTION");

    if (localOrder && localOrder === JSON.stringify(orderAction)) {
      // 존재하고, 새 주문과 일치하면, 일치 표시 후 함수 종료한다.
      console.log("주문 정보가 일치합니다. 주문 저장을 건너뜁니다.");
      return;
    } else {
      // 새 주문을 로컬에 저장한다.
      console.log("새 주문 정보 로컬 저장한다.");
      localStorage.setItem("ORDER_ACTION", JSON.stringify(orderAction));

      if (localOrder) {
        // 로컬에 주문 정보가 있었으므로,
        try {
          // 후단에 저장되었을 갱신 전 주문 정보의 삭제를 요청한다.
          // 로컬에서 주문 ID를 확보한다
          const order_id = localStorage.getItem("ORDER_ID");

          if (order_id) {
            await callWithToken("delete", `/order/${order_id}/delete`);
          }
        } catch (error) {
          console.error("취소된 주문 정보 삭제 실패: ", error);
        }
      }
      // 새 주문 정보 후단 저장 네 단계:
      // 1. 락(Lock) 체크: 이미 저장 중이면, 중복 저장 방지 위해 함수 종료.
      if (isSubmittingRef.current) return;

      // 2. 락 설정: 저장 시작 전, 락을 설정하여 중복 저장 방지.
      isSubmittingRef.current = true;

      // 3. 주문 정보 후단 저장.
      try {
        const response = await saveOrderRecipient(orderAction);
        setOrderId(response.data?.orderId);
      } catch (error) {
        toast.error("주문 저장 오류 - 개발자 콘솔 확인 필요.");
        console.error("주문 저장 실패:", error);
      } finally {
        // 4.  성공 여부 무관, 락 해제.
        isSubmittingRef.current = false;
      }
    }
  }

  async function getTossWidgets() {
    try {
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
      const widgets = tossPayments.widgets({ customerKey });

      // 비회원 결제
      // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      setWidgets(widgets);
    } catch (error) {
      console.error("토스페이먼츠 위젯 오류:", error);
    }
  }

  useEffect(() => {
    saveOrderRecord();
    if (!widgets) {
      getTossWidgets();
    }
  }, []); // 마운트 때 1회 실행

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
      await widgets.setAmount({
        currency: "KRW",
        value: feeData.amount,
      });
      await Promise.all([
        // ------  결제 UI 렌더링 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          // 렌더링하고 싶은 결제 UI의 variantKey
          // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
          // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderagreement
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);
      setReady(true);
    }
    if (widgets !== null) {
      fetchPaymentWidgets();
    }
  }, [widgets]);

  // Reset ready state before payment to prevent warning
  const handlePayment = async () => {
    if (!orderId) {
      return; // 주문 후단 저장 후, 반응에서 얻은 ID orderId 상태에 배정 전.
    }

    try {
      const saveAmountReq = {
        orderId: orderId,
        amount: feeData?.amount,
        orderName: orderData?.orderName,
      };

      console.log("금액 정보: ", JSON.stringify(saveAmountReq));
      const result = await callWithToken(
        "post",
        "/payments/saveAmount",
        saveAmountReq,
      );

      if (result) {
        console.log("결제 요청 전, ", result.data);
      }
    } catch (error) {
      console.error("결제액 세션 저장 실패: ", error);
    }

    try {
      const user = JSON.parse(localStorage.getItem("USER"));

      // Reset React state before navigation
      setReady(false);

      await widgets.requestPayment({
        orderId: orderId,
        orderName: orderData?.orderName,
        successUrl: window.location.origin + "/success",
        failUrl: window.location.origin + "/fail",
        customerEmail: user.email,
        customerName: user.fullName,
      });
    } catch (error) {
      // Restore ready state if payment fails
      setReady(true);
      console.error("결제 요청 오류: ", error);
    }
  };

  const recipient = orderData.recipRegiReq;
  let address = recipient.addressDetail.trim();

  if (address === "") {
    address = getSuffixAfterSpace(recipient.addrBasisAddReq.roadAddress, 20);
  } else {
    address = "..." + address;
  }

  const navigate = useNavigate();

  const goRecipient = () => {
    navigate("/recipient", {
      state: {
        formItems: formItems,
        subTotal: subTotal,
        source: source,
        recipient: recipient,
        wasDefaultRecipient: isDefaultRecipient,
      },
    });
  };

  const cancelPayment = () => {
    localStorage.removeItem("ORDER_ID");
    localStorage.removeItem("ORDER_ACTION");
    navigate("/buy_soap");
  };

  const toRecipient = () => {
    goRecipient();
  };

  return (
    <div className="wrapper checkout-page">
      <div className="box_section">
        <div className="order-summary">
          <OrderDigest
            name={orderData.orderName}
            amount={feeData.amount}
            address={address}
          />
        </div>

        {/* 결제 UI */}
        <div id="payment-method" />

        {/* 이용약관 UI */}
        <div id="agreement" />

        <div id="checkout-buttons">
          <Button
            variant="secondary"
            onClick={cancelPayment} // Use the extracted function
          >
            취소
          </Button>
          <Button
            variant="info"
            onClick={toRecipient} // Use the extracted function
          >
            뒤로
          </Button>
          {/* 결제하기 버튼 */}
          <Button
            variant="success"
            disabled={!ready}
            // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
            // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
            onClick={handlePayment}
          >
            결제
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WidgetCheckoutPage;
