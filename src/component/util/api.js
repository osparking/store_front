import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:9193/api/s1",
});

export async function callWithToken(method, urlSuffix, data = null) {
  try {
    const token = localStorage.getItem("TOKEN");
    if (token) {
      console.log("url: ", `${prefix}${urlSuffix}`);
      let config = {
        method: method,
        url: `${prefix}${urlSuffix}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      if (data) {
        config = {
          method: method,
          url: `${prefix}${urlSuffix}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: data,
        }
      } 
      const result = await axios(config);
      return result;
    } else {
      return null;
    }
  } catch (err) {
    if (err.response.status === HttpStatusCode.Forbidden ||
      err.response.status === HttpStatusCode.Unauthorized
    ) {
      return null;
    } else {
      throw err;
    }
  }
}