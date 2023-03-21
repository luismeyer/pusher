const key = "phr-token";

export const storeToken = (token: string) => {
  localStorage.setItem(key, token);
};

export const loadToken = () => {
  return localStorage.getItem(key);
};

export const clearToken = () => {
  localStorage.removeItem(key);
};
