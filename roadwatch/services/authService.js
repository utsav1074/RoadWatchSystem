import { BASE_URL } from "../config/api";

// ================= LOGIN =================
export const loginUser = async (form) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  return { res, data };
};

// ================= REGISTER =================
export const registerUser = async (form) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  return { res, data };
};
