import { createContext, useContext, useState } from "react";

// 1. Context 생성
const PaymentContext = createContext(null);

// 2. Provider 컴포넌트 정의
export function PaymentProvider({ children }) {
  const [focusPayButton, setFocusPayButton] = useState(false);

  const putFocus2PayButton = () => {
    setFocusPayButton(true);
  };

  const paymentValue = {
    focusPayButton,
    setFocusPayButton,
    putFocus2PayButton,
  };

  return (
    <PaymentContext.Provider value={paymentValue}>
      {children}
    </PaymentContext.Provider>
  );
}

// 3. 커스텀 Hook으로 감싸기 (권장 패턴)
export function usePayment() {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment는 PaymentProvider 외부에서 사용 불가!");
  }
  return context;
}
