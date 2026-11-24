import { jwtDecode } from "jwt-decode";

export const userProps = (jwt) => {
  const decodedToken = jwtDecode(jwt);

  const user = {
    fullName: decodedToken.fullName,
    twoFaEnabled: decodedToken.twoFaEnabled,
  };

  return user;
};
