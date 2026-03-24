import { callWithToken } from "../../util/api";

export async function fetchProducePage(page, size) {
  const urlPrefix = "/worker/produces?page=";

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