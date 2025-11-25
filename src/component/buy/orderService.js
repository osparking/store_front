import { api, callWithToken } from "../util/api";

export async function getDeliveryFee(data) {
  try {
    const result = await callWithToken("post", "/order/get_delivery_fee", data);
    console.log("orderService: ", result.data);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getSoapShapes() {
  try {
    const result = await api.get("/soap/shapes");
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function getOrderStatusList() {
  try {
    const result = await callWithToken("get", "/order/status_list");
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function readUserCart(userId) {
  try {
    const result = await callWithToken("get", `/cart/${userId}/get`);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function searchAddress(addressKey, page, size) {
  const urlPrefix = "/order/address/search?searchKey=";

  try {
    const result = await callWithToken(
      "get",
      `${urlPrefix}${addressKey}&page=${page}&size=${size}`
    );
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function fetchOrderPage(page, size) {
  const urlPrefix = "/order/order_page?page=";

  try {
    const result = await callWithToken(
      "get",
      `${urlPrefix}${page}&size=${size}`
    );
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getOrderDetail(orderId) {
  try {
    const result = await callWithToken(
      "get", `/order/${orderId}/get_details`
    );
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getOrderPage(userId, page, size) {
  const urlPrefix = "/order/myrows?userId=";

  try {
    const result = await callWithToken(
      "get",
      `${urlPrefix}${userId}&page=${page}&size=${size}`
    );
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function updateUserCart(data) {
  try {
    const result = await callWithToken("put", "/cart/update", data);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function changeOrderStatus(data) {
  try {
    const result = await callWithToken("patch", "/order/update_status", data);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function saveOrderRecipient(data) {
  try {
    const result = await callWithToken("post", "/order/add", data);
    return result.data;
  } catch (err) {
    throw err;
  }
}
