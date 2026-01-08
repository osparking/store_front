import { useCallback, useEffect, useRef, useState } from "react";

/* 길이가 length 이내이며, 최대한 길고, 공백문자로 구분된 접미사를 찾아낸다.
 */
export function getSuffixAfterSpace(str, length) {
  if (!str || str.length <= length) {
    return str;
  }

  const startSubString = str.substring(Math.max(0, str.length - length - 1));
  const suffixAfterSpace = startSubString.substring(
    startSubString.indexOf(" ") + 1
  );

  return suffixAfterSpace;
}

export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        console.log(".");
      }, delay);
    },
    [callback, delay]
  );
};

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
  return arrA.filter((item) => !setB.has(item));
};

export function labelsOver(labels, threshold) {
  return labels
    .filter((label) => label.inventory > threshold)
    .map((label) => label.optionLabel);
}

export function handlePropChange(
  e,
  setFormData,
  index = null,
  parentKey = "items"
) {
  const { name, value, checked, type } = e.target;

  let inputValue;

  switch (type) {
    case "checkbox":
      inputValue = checked;
      break;
    case "number":
    case "range":
      inputValue = value === "" ? "" : parseFloat(value);
      break;
    case "radio":
      inputValue = value;
      break;
    case "file":
      inputValue = e.target.files[0];
      break;
    default:
      inputValue = value;
  }

  setFormData((prevState) => {
    if (index !== null) {
      // Handle array items
      const newItems = [...prevState[parentKey]];
      newItems[index][name] = inputValue;
      return { ...prevState, [parentKey]: newItems };
    } else {
      // Handle regular form fields
      return { ...prevState, [name]: inputValue };
    }
  });
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2); // Get last 2 digits
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `'${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
}

export function insertHyphens(phone) {
  return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7, 11)}`;
}

export function getPlainContent(htmlContent) {
  return htmlContent.replace(/<[^>]*>/g, "").trim();
}
