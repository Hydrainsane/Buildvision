import axios from "axios";

/**
 * Base URL of the FastAPI backend.
 * Override via VITE_API_BASE_URL in a .env file when deploying elsewhere.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Shared Axios instance used by every service module.
 * Add new endpoints by creating a new service file under src/services/
 * that imports and reuses this client — never a new axios instance.
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

/**
 * Normalizes Axios errors into a consistent shape the UI can rely on,
 * so every hook/page can handle failures the same way.
 */
export function toApiError(error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return {
        message:
          error.response.data?.detail ||
          error.response.data?.message ||
          `Request failed with status ${error.response.status}`,
        status: error.response.status,
      };
    }
    if (error.request) {
      return {
        message: `Unable to reach the BuildVision backend at ${API_BASE_URL}. Is the FastAPI server running?`,
        status: 0,
      };
    }
  }
  return { message: error?.message || "Unexpected error", status: -1 };
}

export default api;
