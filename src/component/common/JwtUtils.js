import { jwtDecode } from "jwt-decode";

export const jwtToUser = (jwt) => {
  const decodedToken = jwtDecode(jwt);
  console.log("Decoded Token:", decodedToken);

  let isAdmin = decodedToken.roles.includes("ROLE_ADMIN");
  let isWorker = decodedToken.roles.includes("ROLE_WORKER");  

  const user = {
    id: decodedToken.id,
    email: decodedToken.sub,
    fullName: decodedToken.fullName,
    mbPhone: decodedToken.mbPhone,
    roles: decodedToken.roles,
    isAdmin: isAdmin,
    isWorker: isWorker,
    loginMethod: decodedToken.loginMethod,
    signUpMethod: decodedToken.signUpMethod,
    twoFaEnabled: decodedToken.twoFaEnabled,
  };
  console.log("user:", user);

  return user;
};
