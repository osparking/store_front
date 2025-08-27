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
    console.log("data: ", result.data.data);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}