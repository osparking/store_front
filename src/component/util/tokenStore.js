// tokenStore.js
let accessToken = null;  // 모듈 스코프 변수 (메모리)

export const setAccessToken = (t) => { accessToken = t; };
export const getAccessToken = () => accessToken;
export const clearAccessToken = () => { accessToken = null; };