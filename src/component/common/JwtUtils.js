import { jwtDecode } from "jwt-decode";

export const jwtToUser = (jwt) => {
  const decodedToken = jwtDecode(jwt);
  console.log("Decoded Token:", decodedToken);

  let isAdmin = decodedToken.roles.includes("ROLE_ADMIN");

  const user = {
    id: decodedToken.id,
    email: decodedToken.sub,
    fullName: decodedToken.fullName,
    roles: decodedToken.roles,
    isAdmin: isAdmin,
    loginMethod: decodedToken.loginMethod,
    signUpMethod: decodedToken.signUpMethod,
  };
  console.log("user:", user);

  return user;
};
