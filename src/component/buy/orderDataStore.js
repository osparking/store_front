import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

const useOrderDataStore = create(
  immer((set) => ({
    formData: {
      userId: 3,
      items: [],
      orderStatus: "결제대기",
    },
    recipient: {
      default: undefined,
      formUse: null
    },
    defaultChecked: false,

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
