// import axios, { AxiosError, AxiosRequestConfig } from "axios";
// import { useUserStore } from "@/store/UserStore";
// import { getNewToken } from "./authService";

// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const config: AxiosRequestConfig = {
//   baseURL: BASE_URL,
// };

// const baseAxios = axios.create(config);

// const getJwt = async () => {
//   const jwt = useUserStore.getState().jwt;
//   return jwt;
// };

// baseAxios.interceptors.request.use(
//   async (config) => {
//     const jwt = await getJwt();
//     if (jwt) {
//       config.headers.set("Authorization", `Bearer ${jwt}`);
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// let isRefreshing = false;
// let failedQueue: {
//   resolve: (token: string | null) => void;
//   reject: (error: any) => void;
// }[] = [];

// const processQueue = (error: any, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (token) {
//       prom.resolve(token);
//     } else {
//       prom.reject(error);
//     }
//   });

//   failedQueue = [];
// };

// baseAxios.interceptors.response.use(
//   (response) => response, // Trả về response nếu thành công
//   async (error) => {
//     const originalRequest = error.config;

//     // Kiểm tra nếu lỗi 401 (Unauthorized)
//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry
//     ) {
//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = "Bearer " + token;
//             return baseAxios(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       return new Promise(async (resolve, reject) => {
//         const [setRefreshToken, setJwt, refreshToken] = useUserStore(
//           (state) => [state.setRefreshToken, state.setJwt, state.refreshToken]
//         );
//         try {
//           const tokenRefresh = refreshToken; // Hoặc từ cookies
//           if (!tokenRefresh) {
//             throw new Error("Refresh token not available");
//           }

//           const newTokens = await getNewToken(tokenRefresh); // Gọi API để làm mới token
//           const { jwt } = newTokens.data;

//           setRefreshToken(tokenRefresh);
//           baseAxios.defaults.headers["Authorization"] = "Bearer " + jwt;
//           originalRequest.headers["Authorization"] = "Bearer " + jwt;

//           processQueue(null, jwt);
//           resolve(baseAxios(originalRequest));
//         } catch (err) {
//           processQueue(err, null);
//           setJwt(""); // Xóa token khỏi localStorage khi refresh token không hợp lệ
//           reject(err);
//         } finally {
//           isRefreshing = false;
//         }
//       });
//     }

//     return Promise.reject(error);
//   }
// );

// export default baseAxios;