import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PaymentDoneModal from "../modal/PaymentDone";
import { callWithToken } from "../util/api";

export function WidgetSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderName, setOrderName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const bsOrder = {
    orderId: searchParams.get("orderId"),
    amount: parseInt(searchParams.get("amount")),
    paymentKey: searchParams.get("paymentKey"),
  };

  useEffect(() => {
    async function confirm() {
      console.log("확인 대상 결제액: ", JSON.stringify(bsOrder));

      const response = await callWithToken(
        "post",
        "/payments/checkAmount",
        bsOrder
      );
      console.log("response: ", JSON.stringify(response));

      if (response.data.matches) {
        console.log("결제 금액 일치 확인");
        setOrderName(response.data.orderName);
      } else {
        throw { message: "결제 금액 불일치 오류", code: 400 };
      }

      await callWithToken("post", "/payments/confirm", bsOrder);
    }

    confirm()
      .then(() => {
        setIsModalOpen(true);
      })
      .catch((error) => {
        navigate(`/fail?code=${error.code}&message=${error.message}`);
      });
  }, [searchParams]);

  const doneData = [
    { property: "구매 항목:", value: orderName },
    { property: "주문 번호:", value: bsOrder.orderId },
    {
      property: "결제 금액:",
      value: Number(bsOrder.amount).toLocaleString() + "원",
    },
    { property: "결제 키:", value: bsOrder.paymentKey },
  ];

  function closeModal() {
    setIsModalOpen(false);
    navigate("/myorders");
  }

  return (
    <>
      <PaymentDoneModal
        show={isModalOpen}
        onHide={closeModal}
        title="결제 완료"
      >
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
        />
        <h4>결제 완료 내용:</h4>
        <table border="1" style={{ borderCollapse: "collapse", width: "80%" }}>
          <tbody>
            {doneData.map((item, index) => (
              <tr key={index}>
                <th
                  style={{
                    textAlign: "right",
                    padding: "8px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {item.property}
                </th>
                <td style={{ padding: "8px", textAlign: "left" }}>
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PaymentDoneModal>
    </>
  );
}
