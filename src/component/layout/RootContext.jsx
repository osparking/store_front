import { createContext, useCallback, useContext, useState } from "react";

// context 생성
const RootContext = createContext(null);

export function RootProvider({ children }) {
  const [userVersion, setUserVersion] = useState(0);

  const refreshUser = useCallback(() => {
    setUserVersion((prev) => prev + 1);
  }, []);

  const rootValue = {
    userVersion,
    refreshUser,
  };

  return (
    <RootContext.Provider value={rootValue}>{children}</RootContext.Provider>
  );
}

// 커스텀 Hook으로 감싸기 (권장 패턴)
export function useRoot() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error("useRoot는 RootProvider 안에서 사용 가능.");
  }
  return context;
}
