import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
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
    source,
    toDefaultRecipient,
    isDefaultRecipient,
  } = location.state;

  const [widgets, setWidgets] = useState(null);
  const [ready, setReady] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    async function saveOrderRecord() {
      let action = "";
      // 유저의 기본 수신처 갱신 
      if (toDefaultRecipient) {
        if (!isDefaultRecipient) {
          action = "remove";
        }
      } else if (isDefaultRecipient) {
          action = "store";
      }

      const orderAction = { ...orderData, defaultRecipientAction: action };
      const response = await saveOrderRecipient(orderAction);

      setOrderId(response.data?.orderId);
    }
    saveOrderRecord();

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
    getTossWidgets();
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
        saveAmountReq
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
  }

  const navigate = useNavigate();
  const goRecipient = () => {
    navigate("/recipient", {
      state: {
        formItems: formItems,
        source: source,
        recipient: recipient,
        wasDefaultRecipient: isDefaultRecipient,
      },
    });
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        <OrderDigest
          name={orderData.orderName}
          amount={feeData.amount}
          address={address}
          goRecipient={goRecipient}
        />

        {/* 결제 UI */}
        <div id="payment-method" />

        {/* 이용약관 UI */}
        <div id="agreement" />

        {/* 결제하기 버튼 */}
        <button
          className="button"
          style={{ marginTop: "30px" }}
          disabled={!ready}
          // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
          // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
          onClick={handlePayment}
        >
          결제 하기
        </button>
      </div>
    </div>
  );
}

export default WidgetCheckoutPage;
