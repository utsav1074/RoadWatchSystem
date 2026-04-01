import { BASE_URL } from "../config/api";

// ================= GET TOKEN =================
const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

// ================= GET REPORT BY ID =================
export const getReportById = async (id) => {
  const headers = getAuthHeader();

  const res = await fetch(`${BASE_URL}/admin/reports/${id}`, {
    method: "GET",
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch report");
  }

  return data[0]; // backend returns array
};

// ================= REVIEW REPORT =================
export const reviewReport = async (reportId, status, notes) => {
  const headers = getAuthHeader();

  const res = await fetch(`${BASE_URL}/admin/reports/${reportId}`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, notes }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Review failed");
  }

  return data;
};
