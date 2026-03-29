import type { Role } from "../types";

export const decodeRoleFromToken = (token: string): Role => {
  if (!token) return "unknown";
  try {
    const payload = token.split(".")[1];
    if (!payload) return "unknown";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    const parsed = JSON.parse(decoded) as { role?: string };
    if (parsed.role === "admin" || parsed.role === "manager") {
      return parsed.role;
    }
    return "unknown";
  } catch {
    return "unknown";
  }
};
