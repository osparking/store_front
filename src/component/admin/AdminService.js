import { callWithToken } from "../util/api";

export async function getSoapPrices() {
  try {
    const result = await callWithToken("get", "/soap/prices");
    return result.data;
  } catch (err) {
    throw err;
  }
}
