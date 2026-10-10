import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const STATUS_COLORS = {
  Applied: "#0284c7",
  Interview: "#7c3aed",
  Assessment: "#d97706",
  Offer: "#16a34a",
  Rejected: "#dc2626",
};

export default function StatusChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const visible = data.filter((item) => item.value > 0);

  return (
    <div className="card">
      <div className="card__header">
        <div>
          <h3 className="card__title">Application status</h3>
          <p className="card__subtitle">Where your applications stand</p>
        </div>
      </div>

      {total === 0 ? (
        <p className="muted" style={{ padding: "60px 0", textAlign: "center" }}>
          No data yet. Add an application to see the chart.
        </p>
      ) : (
        <>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={visible}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {visible.map((item) => (
                    <Cell key={item.name} fill={STATUS_COLORS[item.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul
            style={{
              listStyle: "none",
              margin: "12px 0 0",
              padding: 0,
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 18px",
              justifyContent: "center",
            }}
          >
            {data.map((item) => (
              <li
                key={item.name}
                className="muted"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: STATUS_COLORS[item.name],
                  }}
                />
                {item.name}: <strong style={{ color: "var(--text)" }}>{item.value}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}