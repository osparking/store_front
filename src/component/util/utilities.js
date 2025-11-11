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

  return `${year}년${month}월${day}일 ${hours}:${minutes}`;
}
