import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useOrderDataStore = create(
  immer((set) => ({
    formData: {
      userId: 3,
      items: [],
      orderStatus: '결재대기',
    },
    setFormData: (newData) =>
      set((state) => {
        // ✅ 이제 이렇게 깊은 곳도 직관적으로 수정 가능
        state.formData = { ...state.formData, ...newData };
        // 또는 state.formData.items[0].shape = 'newValue';
      }),
  }))
);

export { useOrderDataStore };
