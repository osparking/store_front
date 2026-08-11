import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useOrderDataStore = create(
  immer((set) => ({
    formData: {
      items: [],
      subTotal: { count: 0, price: 0 },
    },

    recipient: {
      default: undefined,
      formUse: null,
    },

    defaultChecked: false,

    orderData: {
      userId: 0,
      items: [],
      recipRegiReq: null,
      orderStatus: "결제대기",
      orderName: "",
      amount: 0,
    },

    setMemberData: (member, newData) =>
      set((state) => {
        // ✅ Immer 스타일: 직접 병합 (불변성은 Immer가 보장)
        Object.assign(state[member], newData);
      }),

    setDefaultChecked: (defaultChecked) =>
      set((state) => {
        state.defaultChecked = defaultChecked;
      }),
  })),
);

export { useOrderDataStore };
