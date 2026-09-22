import { createContext, useContext, useMemo, useRef, useState } from "react";

const MaximizeContext = createContext(null);

export function MaximizeProvider({ children }) {
  const [isMaximized, setIsMaximized] = useState(false);
  const saveStateRef = useRef(null);
  const restoreStateRef = useRef(null);

  const toggleMaximize = () => {
    if (!isMaximized) {
      // 최대화: 먼저 저장, 그 다음 상태 변경
      saveStateRef.current?.();
      setIsMaximized(true);
    } else {
      // 복원: 먼저 상태 변경, 그 다음 복원
      setIsMaximized(false);
      // CSS 클래스가 빠진 뒤 복원되도록 다음 틱에
      requestAnimationFrame(() => restoreStateRef.current?.());
    }
  };

  const maximizeActions = useMemo(() => {
    return {
      registerSave: (fn) => {
        saveStateRef.current = fn;
      },
      registerRestore: (fn) => {
        restoreStateRef.current = fn;
      },
    };
  }, []);

  const maximizeValue = useMemo(() => {
    return {
      ...maximizeActions,
      isMaximized,
      setIsMaximized,
      toggleMaximize,
    };
  }, [maximizeActions, isMaximized, toggleMaximize]);

  return (
    <MaximizeContext.Provider value={maximizeValue}>
      {children}
    </MaximizeContext.Provider>
  );
}

export function useMaximize() {
  const context = useContext(MaximizeContext);

  if (!context) {
    throw new Error("useMaximize는 MaximizeProvider 외부 사용 불가!");
  }
  return context;
}
