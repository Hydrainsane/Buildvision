import { api, toApiError } from "./api";

/**
 * GET / — basic backend health/root check.
 * Useful for a "backend reachable" indicator in the UI.
 */
export async function getHealth() {
  try {
    const { data } = await api.get("/");
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * GET /incidents — the single source of truth for every incident
 * record produced by the YOLO + Gemini detection pipeline and stored
 * in SQLite. The dashboard, incident history, and incident detail
 * views all derive their data from this list — nothing is hardcoded.
 *
 * Returns an array of incident records. The backend response shape
 * is normalized defensively (some FastAPI setups wrap lists in
 * { items: [...] } or { data: [...] }) so the UI never breaks if the
 * envelope changes shape slightly.
 */
export async function getIncidents() {
  try {
    const { data } = await api.get("/incidents");
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.incidents)) return data.incidents;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * Convenience lookup for a single incident by id, sourced from the
 * already-fetched incident list rather than a dedicated endpoint,
 * since the backend currently exposes only the collection route.
 * If a GET /incidents/{id} endpoint is added later, swap the body
 * of this function for a direct request — callers won't need to change.
 */
export function findIncidentById(incidents, id) {
  return incidents.find((incident) => String(incident.id) === String(id)) || null;
}
