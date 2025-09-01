import { api, callWithToken } from "../util/api";

export async function getSoapShapes() {
  try {
    const result = await api.get('/soap/shapes');
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

export async function updateUserCart(data) {
  try {
    const result = await callWithToken("put", "/cart/update", data);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}