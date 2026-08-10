import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useOrderDataStore = create(
  immer((set) => ({
    formData: {
      userId: 3,
      items: [],
      subTotal: { count: 0, price: 0 },
      orderStatus: "결제대기",
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
    },

    feeData: {
      productTotal: 0,
      deliveryFee: 0,
      amount: 0,
    },

    setMemberData: (member, newData) =>
      set((state) => {
        Object.assign(state[member], newData);
      }),

    setOrderData: (newData) =>
      set((state) => {
        Object.assign(state.orderData, newData);
      }),

    setFormData: (newData) =>
      set((state) => {
        // ✅ Immer 스타일: 직접 병합 (불변성은 Immer가 보장)
        Object.assign(state.formData, newData);
      }),

    setRecipient: (newData) =>
      set((state) => {
        Object.assign(state.recipient, newData);
      }),

    setDefaultChecked: (defaultChecked) =>
      set((state) => {
        state.defaultChecked = defaultChecked;
      }),
  })),
);

export { useOrderDataStore };
