import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// 초기값을 상수로 분리 (재사용 + 오타 방지)
const initialState = {
  formData: {
    items: [],
    subTotal: { count: 0, price: 0 },
  },
  recipient: {
    default: undefined,
    formUse: null,
    defaultChecked: false,
  },
  orderData: {
    userId: 0,
    items: [],
    recipRegiReq: null,
    orderStatus: "결제대기",
    orderName: "",
    amount: 0,
    delivery: 0,
  },
  orderEtc: {
    id: null,
    idToss: null,
    storedAction: null,
  },
};

const useOrderDataStore = create(
  persist(
    immer((set) => ({
      ...initialState,
      setMemberData: (member, newData) =>
        set((state) => {
          Object.assign(state[member], newData);
        }),
      // ✅ 스토어 내부에 reset 정의
      resetOrderData: () =>
        set((state) => {
          // immer 환경에서는 Object.assign으로 최상위 키를 덮어쓰면 됨
          Object.assign(state, initialState);
        }),
    })),
    {
      name: "order-storage",
    },
  ),
);

// ✅ 로그아웃 시 호출할 헬퍼 (메모리 초기화 + 스토리지 삭제)
export const resetOrderData = () => {
  useOrderDataStore.getState().resetOrderData();
  useOrderDataStore.persist.clearStorage();
};

export { useOrderDataStore };