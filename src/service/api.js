import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api.al-aminhmb.com/api";

export const no_image = "https://api.al-aminhmb.com/AlAmin/assets/images/Category/no-image.png";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json-patch+json",
  },
});

// Request interceptor to add dynamic headers
api.interceptors.request.use(
  async (config) => {
    const clientDb = await AsyncStorage.getItem("x-client-db");
    if (clientDb) {
      config.headers["X-Client-Db"] = clientDb;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get company branding settings
export const getCompanySetting = (code) => {
  return api.get(`/Company/GetCompanySetting/${code}`);
};

// Logout helper
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("branding");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export default api;

