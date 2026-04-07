import { BASE_URL } from "../config/api";

// ================= TOKEN =================
const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ================= FETCH USERS =================
export const fetchUsers = async (search = "") => {
  const headers = getAuthHeader();

  const query = new URLSearchParams({ search }).toString();

  const res = await fetch(`${BASE_URL}/admin/users?${query}`, {
    method: "GET",
    headers,
  });

  const data = await res.json();

  return { res, data };
};

// ================= GET SINGLE =================
export const getUser = async (id) => {
  const headers = getAuthHeader();

  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: "GET",
    headers,
  });

  const data = await res.json();

  return { res, data };
};

// ================= UPDATE =================
export const updateUser = async (id, payload) => {
  const headers = getAuthHeader();

  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  return { res, data };
};

// ================= DELETE =================
export const deleteUser = async (id) => {
  const headers = getAuthHeader();

  const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers,
  });

  const data = await res.json();

  return { res, data };
};
