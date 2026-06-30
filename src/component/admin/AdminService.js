import { callWithToken } from "../util/api";

export async function getSoapPrices() {
  try {
    const result = await callWithToken("get", "/soap/prices");
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function saveNewFeeEtc(feeEtc) {
  try {
    const result = await callWithToken("post", "/admin/add_fee_etc", feeEtc);
    console.log("result2: ", result);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function saveNewSoapPrice(soapPrice) {
  try {
    const result = await callWithToken("post", "/admin/add_price", soapPrice);
    return result.data;
  } catch (err) {
    throw err;
  }
}
