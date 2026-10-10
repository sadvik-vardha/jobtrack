import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getWeeklyActivity, getMonthlyActivity } from "../utils/stats";

export default function ActivityChart({ applications }) {
  const [view, setView] = useState("weekly");

  const data =
    view === "weekly"
      ? getWeeklyActivity(applications)
      : getMonthlyActivity(applications);

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <h3 className="card__title">Application activity</h3>
          <p className="card__subtitle">
            {view === "weekly" ? "Applications per week (last 8 weeks)" : "Applications per month (last 6 months)"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            className={`btn btn--sm ${view === "weekly" ? "btn--primary" : "btn--secondary"}`}
            onClick={() => setView("weekly")}
          >
            Weekly
          </button>
          <button
            className={`btn btn--sm ${view === "monthly" ? "btn--primary" : "btn--secondary"}`}
            onClick={() => setView("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="chart-box" style={{ height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7ef" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip cursor={{ fill: "#eef0ff" }} />
            <Bar
              dataKey="count"
              name="Applications"
              fill="#4f46e5"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}