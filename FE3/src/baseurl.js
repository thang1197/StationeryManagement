const baseURL =
  process.env.NODE_ENV !== "production"
    ? process.env.REACT_APP_API_URL_UAT
    : process.env.REACT_APP_API_URL_PRO;

export default baseURL;