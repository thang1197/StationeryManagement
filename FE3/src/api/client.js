import axios from "axios";
import baseURL from "../baseurl";
const instance = axios.create({
  baseURL: baseURL,
});

const accessTokenHoc = (previousAPI) => {
  const innerAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const token = localStorage.getItem("token");
    const res = await instance.post(`api/Login/RefreshToken`, {
      token,
      refreshToken,
    });
    if (res) {
      if (res.data.token && res.data.refreshToken) {
        localStorage.setItem("name", res.data.employeeName);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        previousAPI.headers.Authorization = `Bearer ${token}`;
        return instance.request(previousAPI);
      } else {
        localStorage.setItem("token", "");
        localStorage.setItem("refreshToken", "");
        localStorage.setItem("name", "");
      }
    }
  };
  return innerAccessToken;
};

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },

  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(null, function (error) {
  if (
    error.config &&
    error.response?.status === 401 &&
    !error.config.__isRetry
  ) {
    return new Promise((resolve, reject) => {
      const callAccess = accessTokenHoc(error.config);
      callAccess(error.config)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  return Promise.reject(error);
});

export default instance;
