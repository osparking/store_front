import { callWithToken } from "../util/api";

export async function getCustomerList() {
  try {
    const url = "/admin/customer/get_all";
    const result = await callWithToken("get", url);
    return result.data;
  } catch (err) {
    throw err;
  }
}
