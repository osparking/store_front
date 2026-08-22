import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

const useOrderDataStore = create(
  persist(
    immer((set) => ({
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
      },
      setMemberData: (member, newData) =>
        set((state) => {
          Object.assign(state[member], newData);
        }),
    })),
    {
      name: "order-storage",
    },
  ),
);

export { useOrderDataStore };
