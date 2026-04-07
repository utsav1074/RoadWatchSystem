import { BASE_URL } from "../config/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};


export const fetchDashboardAnalytics = async () => {
  const headers = getAuthHeader();

  const res = await fetch(`${BASE_URL}/admin/dashboard`, {
    method: "GET",
    headers,
  });

  const data = await res.json();
  return { res, data };
};
