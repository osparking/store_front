import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 문자열에서 정한 길이의 접미사를 취하고, 그 중 첫 공백 우측 부분을 반환한다.
 * @param {string} str - 문자열
 * @param {number} length - 접미사 길이
 * @returns {string} 주어진 길이의 접미사에서 첫 공백 우측 부분
 */
export function getSuffixAfterSpace(str, length) {
  if (!str || str.length <= length) {
    return str;
  }

  const startSubString = str.substring(Math.max(0, str.length - length - 1));
  const suffixAfterSpace = startSubString.substring(
    startSubString.indexOf(" ") + 1,
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
    [callback, delay],
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

export const storeLoginInfo = (user) => {
  console.log("storeLoginInfo - user: ", user);
  localStorage.setItem("USER", JSON.stringify(user));
  localStorage.setItem("LOGIN_ID", user.id);
  localStorage.setItem("IS_ADMIN", user.isAdmin);
  localStorage.setItem("IS_WORKER", user.isWorker);
};

export const storeJWT = (token, save_login) => {
  if (save_login) {
    // ON: localStorage에 저장 (브라우저 종료 후에도 유지)
    localStorage.setItem("TOKEN", token);
  } else {
    // OFF: sessionStorage에 저장 (브라우저/탭 종료 시 삭제)
    sessionStorage.setItem("TOKEN", token);
  }
};

export const getStorageToken = () => {
  return getValidJWT_removeIfNot() || sessionStorage.getItem("TOKEN");
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
  parentKey = "items",
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

export function insert2Hyphens(phone) {
  return phone
    ? `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7, 11)}`
    : "";
}

export function insertHyphens(phone) {
  if (phone.length <= 3) {
    return phone;
  } else if (phone.length <= 7) {
    return `${phone.slice(0, 3)}-${phone.slice(3)}`;
  } else {
    return `${phone.slice(0, 3)}-${phone.slice(3, 7)}-${phone.slice(7, 11)}`;
  }
}

export function handlePhoneChange(e, setPhoneNumber) {
  const input = e.target.value;
  const cleaned = input.replace(/\D/g, "");
  setPhoneNumber(cleaned);
}

export function getPlainContent(htmlContent) {
  return htmlContent.replace(/<[^>]*>/g, "").trim();
}

export const expiredTokenRemoved = () => {
  const token = getStorageToken();

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp > currentTime) {
        return false;
      } else {
        removeStorageToken();
        return true;
      }
    } catch (error) {
      removeStorageToken();
      console.error("Error decoding token:", error);
      return true;
    }
  } else {
    return true;
  }
};

const getValidJWT_removeIfNot = () => {
  const token = localStorage.getItem("TOKEN");

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp > currentTime) {
        return token;
      }else {
        localStorage.removeItem("TOKEN")
      }
    } catch (error) {
      localStorage.removeItem("TOKEN")
      console.error("Error decoding token:", error);
    }
  }
  return undefined;
}

const removeStorageToken = () => {
  if ("true" === localStorage.getItem("SAVE_LOGIN")) {
    localStorage.removeItem("TOKEN"); // 토큰 제거됨
  } else {
    sessionStorage.removeItem("TOKEN");
  }
};

export const getRecordRange = (thePage, idxFirst, idxLastPlus1, name) => {
  const recordRange =
    thePage.totalElements === 0
      ? "(자료 없음)"
      : `(총 ${thePage.totalElements} 건 중, 제 ${idxFirst + 1}` +
        ` ~ ${Math.min(idxLastPlus1, thePage.totalElements)} 번 ` +
        name +
        ")";
  return recordRange;
};

export const getSubTotal = (orderItems) => {
  if (!orderItems || orderItems.length === 0) {
    return { count: 0, price: 0 };
  }

  return orderItems.reduce(
    (result, item) => {
      // count를 숫자로 변환 (type 2는 문자열일 수 있음)
      const count = Number(item.count);

      // price 계산: type 1은 subTotal 사용, type 2는 price * count 사용
      let price;
      if (item.subTotal !== undefined) {
        // type 1: subTotal이 있는 경우
        price = item.subTotal;
      } else if (item.price !== undefined) {
        // type 2: price가 있는 경우
        price = item.price * count;
      } else {
        // 두 속성이 모두 없는 경우 (에러 처리)
        price = 0;
      }

      return {
        count: result.count + count,
        price: result.price + price,
      };
    },
    { count: 0, price: 0 },
  );
};

export const clearLocalOrderData = () => {
  localStorage.removeItem("ORDER_ID");
  localStorage.removeItem("ORDER_ACTION");
  localStorage.removeItem("ORDER_ID_TOSS");
};

export const formatTime = (isoString) => {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours}시 ${minutes.toString().padStart(2, "0")}분`;
};

export const maskEmail = (email) => {
  return email.replace(/^(.{3})(.*)@/, (match, firstThree, rest) => {
    return firstThree + "*".repeat(rest.length) + "@";
  });
};

export const HTTP_STATUS = {
  OK: 200,
  CLOSED: 202,
  ALREADY_REPORTED: 208,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export function validatePassword(password, confirm) {
  if (typeof password !== "string") return false;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  // ! @ # $ % ^ & * ( ) - _ = +
  const hasSpecial = /[!@#\$%\^&\*\(\)\-_=\+]/.test(password);
  const onlyAllowed = /^[a-zA-Z0-9!@#$%\^&*()\-_=+]+$/.test(password);
  return (
    hasLower &&
    hasUpper &&
    hasDigit &&
    hasSpecial &&
    onlyAllowed &&
    password.length >= 9 &&
    password === confirm
  );
}
