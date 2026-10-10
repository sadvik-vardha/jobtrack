import { STATUSES } from "./constants";
import { todayISO } from "./helpers";

function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getStats(apps) {
  const count = (status) => apps.filter((a) => a.status === status).length;
  return {
    total: apps.length,
    interviews: count("Interview"),
    offers: count("Offer"),
    rejections: count("Rejected"),
  };
}

export function getStatusData(apps) {
  return STATUSES.map((name) => ({
    name,
    value: apps.filter((a) => a.status === name).length,
  }));
}

// Last 8 weeks, each bucket = 7 days. Oldest first.
export function getWeeklyActivity(apps, weeks = 8) {
  const today = parseISO(todayISO());
  const buckets = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const end = new Date(today);
    end.setDate(today.getDate() - i * 7);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    buckets.push({
      label: start.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      count: 0,
      start,
      end,
    });
  }

  apps.forEach((app) => {
    const d = parseISO(app.dateApplied);
    const bucket = buckets.find((b) => d >= b.start && d <= b.end);
    if (bucket) bucket.count += 1;
  });

  return buckets.map(({ label, count }) => ({ label, count }));
}

// Last 6 months including this one. Oldest first.
export function getMonthlyActivity(apps, months = 6) {
  const now = new Date();
  const buckets = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      count: 0,
    });
  }

  apps.forEach((app) => {
    const d = parseISO(app.dateApplied);
    const bucket = buckets.find((b) => b.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (bucket) bucket.count += 1;
  });

  return buckets.map(({ label, count }) => ({ label, count }));
}