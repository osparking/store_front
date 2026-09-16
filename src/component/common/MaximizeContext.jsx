import { createContext } from "react";

export const MaximizeContext = createContext({
  isMaximized: false,
  registerSave: () => {},
  registerRestore: () => {},
});
