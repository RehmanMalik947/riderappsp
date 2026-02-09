import axios from "axios";

const API_URL = "https://api.al-aminhmb.com/api";
export const CompanyCode = "Rubaika";
// export const CompanyCode = "ALAmin";

export const no_image = "https://api.al-aminhmb.com/AlAmin/assets/images/Category/no-image.png";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json-patch+json",
    "X-Client-Db": CompanyCode, // 👈 YE ADD KIYA
  },
});

// Logout helper
export const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};

export default api;
