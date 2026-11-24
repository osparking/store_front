import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

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
        delivery: 0,
      },
      orderEtc: {
        id: null,
        idToss: null,
        storedAction: null
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

