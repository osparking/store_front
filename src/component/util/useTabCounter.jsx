// useTabCounter.js
import { useEffect } from "react";

const useTabCounter = () => {
  useEffect(() => {
    // const tabId = Date.now() + Math.random().toString(36).substr(2, 9);
    // sessionStorage.setItem("TAB_ID", tabId);

    // const storedTabs = JSON.parse(localStorage.getItem("ACTIVE_TABS") || "{}");
    // storedTabs[tabId] = Date.now();
    // localStorage.setItem("ACTIVE_TABS", JSON.stringify(storedTabs));
    // localStorage.setItem("TAB_COUNT", Object.keys(storedTabs).length);

    const handleBeforeUnload = (event) => {
      // This message might not be shown in modern browsers
      const message = 'Are you sure you want to leave? Changes may not be saved.';
      event.preventDefault();
      event.returnValue = message; // Standard for most browsers
      return message; // For older browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);    

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };    

    // return () => {
    //   const cleanupTabId = sessionStorage.getItem("TAB_ID");
    //   if (cleanupTabId) {
    //     const cleanupTabs = JSON.parse(
    //       localStorage.getItem("ACTIVE_TABS") || "{}"
    //     );
    //     delete cleanupTabs[cleanupTabId];
    //     localStorage.setItem("ACTIVE_TABS", JSON.stringify(cleanupTabs));
    //     localStorage.setItem("TAB_COUNT", Object.keys(cleanupTabs).length);
    //   }
    // };
  }, []);
};

export default useTabCounter;
