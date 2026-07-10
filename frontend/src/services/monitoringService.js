import { api, API_BASE_URL, toApiError } from "./api";

/**
 * Live monitoring endpoints.
 *
 * The two endpoints confirmed on the backend today are `GET /` and
 * `GET /incidents`. The Live Monitoring page additionally expects the
 * following FastAPI routes to exist on the same server so the camera
 * feed, compliance readouts, and AI recommendation can be driven by
 * real detections rather than placeholder values:
 *
 *   POST /monitoring/start   -> starts the YOLO/Gemini pipeline
 *   POST /monitoring/stop    -> stops the pipeline
 *   GET  /monitoring/status  -> current worker count, compliance %,
 *                                safety score, risk level, recommendation
 *   GET  /monitoring/feed    -> MJPEG/streamed image endpoint for <img>
 *
 * Every call below fails gracefully (see toApiError) so the UI can
 * show a clear "service unavailable" state instead of fabricating
 * numbers when a route isn't wired up yet. Add new monitoring routes
 * here only — components should never call axios directly.
 */

export async function startMonitoring() {
  try {
    const { data } = await api.post("/monitoring/start");
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function stopMonitoring() {
  try {
    const { data } = await api.post("/monitoring/stop");
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

export async function getMonitoringStatus() {
  try {
    const { data } = await api.get("/monitoring/status");
    return data;
  } catch (error) {
    throw toApiError(error);
  }
}

/**
 * Builds the URL for the live camera stream <img> tag. Kept as a pure
 * URL builder (not an axios call) since MJPEG streams are consumed
 * directly by the browser's <img src>, not fetched via JS.
 */
export function getLiveFeedUrl() {
  return `${API_BASE_URL}/monitoring/feed`;
}
