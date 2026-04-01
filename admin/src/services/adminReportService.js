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

// ================= GET ALL REPORTS =================
export const fetchReports = async (search = "", status = "All") => {
  const headers = getAuthHeader();

  const query = new URLSearchParams({
    search,
    status,
  }).toString();

  const res = await fetch(`${BASE_URL}/admin/reports?${query}`, {
    method: "GET",
    headers,
  });

  const data = await res.json();

  return { res, data };
};

// ================= DELETE REPORT =================
export const deleteReport = async (id) => {
  const headers = getAuthHeader();

  const res = await fetch(`${BASE_URL}/admin/reports/${id}`, {
    method: "DELETE",
    headers,
  });

  const data = await res.json();

  return { res, data };
};
