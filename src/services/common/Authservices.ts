// File: src/services/authService.ts

import { callApi } from "../../helper/httpHelper";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    name: string;
    email: string;
    role: string;
  };
};

async function login(credentials: LoginRequest): Promise<LoginResponse> {
  console.log("ENV:", import.meta.env.MODE, "DEV:", import.meta.env.DEV);

  if (import.meta.env.DEV) {
    await new Promise(res => setTimeout(res, 500));

    if (
      credentials.username.trim() === "admin@example.com" &&
      credentials.password.trim() === "Password@123"
    ) {
      return {
        success: true,
        token: "mock-jwt-token",
        user: {
          id: 1,
          username: "admin",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      };
    }

    throw new Error("Invalid credentials");
  }

  return callApi<LoginResponse>("/auth/login", "POST", credentials);
}

function logout() {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user");
  localStorage.removeItem("token_expires_at");
}
// 👉 Create a service object
const AuthServices = {
  login,
  logout,
};

// 👉 Export it as default
export default AuthServices;
