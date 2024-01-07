const key = "phr-token";

export const storeToken = (token: string) => {
  document.cookie = `${key}=${token}`;
};

export const clearToken = () => {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
