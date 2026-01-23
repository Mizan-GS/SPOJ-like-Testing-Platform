import { jwtDecode } from "jwt-decode";

export const getToken = () => sessionStorage.getItem("token");

export const getDecodedToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (e) {
    console.warn('Failed to decode token', e);
    return null;
  }
};

export const isTokenExpired = () => {
  const decoded = getDecodedToken();
  if (!decoded || !decoded.exp) return true;

  return decoded.exp * 1000 <= Date.now();
};

export const clearAuth = () => {
  sessionStorage.removeItem("token");
    sessionStorage.removeItem("currentUser");
    sessionStorage.removeItem("role");
};
