import { callWithToken } from "../util/api";

export async function getCustomerPage(page, size, email, name) {
  const urlPrefix = "/admin/get_customer_page?page=";

  try {
    const url = `${urlPrefix}${page}&size=${size}&email=${email}&name=${name}`;
    const result = await callWithToken("get", url);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getCustomerList() {
  try {
    const url = "/admin/customer/get_all";
    const result = await callWithToken("get", url);
    return result.data;
  } catch (err) {
    throw err;
  }
}

export async function fetchMeInfo() {
  try {
    const url = "/user/me";
    const result = await callWithToken("get", url);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}

export async function fetchUserInfo(userId) {
  try {
    const url = `/user/${userId}/info`;
    const result = await callWithToken("get", url);
    return result.data.data;
  } catch (err) {
    throw err;
  }
}
