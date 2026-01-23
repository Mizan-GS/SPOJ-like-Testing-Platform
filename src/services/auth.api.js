import { toast } from "react-toastify";
import axiosClient from "./axiosClient";

export async function loginaction(email, password) {
  try {
    console.log("LOGIN PAYLOAD", { email, password });

    const res = await axiosClient.post("/auth/login", { email, password });
    toast.success("Login successful");
    return res;
  } catch (err) {
    toast.error(err.response?.data?.message || "Invalid credentials");
    throw err;
  }
}
