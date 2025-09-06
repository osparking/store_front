import axios, { HttpStatusCode } from "axios";

const prefix = "http://localhost:9193/api/s1";

export const api = axios.create({
  baseURL: prefix,
});

const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export async function callWithToken(method, urlSuffix, data = null) {
  try {
    const token = localStorage.getItem("TOKEN");
    if (token) {      
      console.log("url: ", `${prefix}${urlSuffix}`);

      if (isTokenExpired(token)) {
        // Token expired, redirect to login
        localStorage.removeItem('TOKEN');
        window.location.href = '/login';
        return Promise.reject(new Error('Token expired'));
      }

      let config = {
        method: method,
        url: `${prefix}${urlSuffix}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (data) {
        config = {
          method: method,
          url: `${prefix}${urlSuffix}`,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: data,
        };
      }
      const result = await axios(config);
      return result;
    } else {
      return null;
    }
  } catch (err) {
    console.error("erro:", err);
    if (
      err.response.status === HttpStatusCode.Forbidden ||
      err.response.status === HttpStatusCode.Unauthorized
    ) {
      return null;
    } else {
      throw err;
    }
  }
}
