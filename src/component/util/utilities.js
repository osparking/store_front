import { useEffect, useState } from "react";

export const useAlertTimeout = (initialVisibility = false, duration = 9000) => {
  const [showAlert, setShowAlert] = useState(initialVisibility);

  useEffect(() => {
    let timer;
    if (showAlert) {
      timer = setTimeout(() => setShowAlert(false), duration);
    }
    return () => clearTimeout(timer);
  }, [showAlert, duration]);

  return [showAlert, setShowAlert];
};

export const storeLoginInfo = (user, token) => {  
  localStorage.setItem("USER", JSON.stringify(user));
  localStorage.setItem("LOGIN_ID", user.id);
  localStorage.setItem("TOKEN", token);
  localStorage.setItem("IS_ADMIN", user.isAdmin);
  localStorage.setItem("IS_WORKER", user.isWorker);
};

export const setDifference = (arrA, arrB) => {
  const setB = new Set(arrB);
  return arrA.filter(item => !setB.has(item));
};