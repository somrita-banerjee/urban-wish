export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);

export const getUserType = () => localStorage.getItem("user_type");
export const setUserType = (token: string) =>
  localStorage.setItem("user_type", token);

export const clearLocalStorage = () => localStorage.clear();

export const storeAfterLogin = (token: string, type: string) => {
  setToken(token);
  setUserType(type);
};


