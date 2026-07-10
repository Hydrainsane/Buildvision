import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names conditionally, resolving conflicts.
 * Standard shadcn/ui helper.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO timestamp string into a readable date + time.
 * Returns "—" when the value is missing or invalid.
 */
export function formatTimestamp(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Normalize a risk level string (e.g. "high", "High", "HIGH") to
 * one of "high" | "medium" | "low" | "unknown".
 */
export function normalizeRisk(level) {
  if (!level) return "unknown";
  const v = String(level).trim().toLowerCase();
  if (v.startsWith("high")) return "high";
  if (v.startsWith("med")) return "medium";
  if (v.startsWith("low")) return "low";
  return "unknown";
}

/**
 * Safely coerce a value to a finite number, otherwise return null.
 */
export function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Format a percentage-like number for display, clamping 0-100.
 */
export function formatPercent(value, fractionDigits = 0) {
  const n = toNumber(value);
  if (n === null) return "—";
  const clamped = Math.max(0, Math.min(100, n));
  return `${clamped.toFixed(fractionDigits)}%`;
}
