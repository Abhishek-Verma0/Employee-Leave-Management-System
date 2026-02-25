import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
};

const StatusChart = ({ title, data }) => {
  const chartData = [
    { name: "Pending", value: data.pending || 0 },
    { name: "Approved", value: data.approved || 0 },
    { name: "Rejected", value: data.rejected || 0 },
  ];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl border p-5"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <p
          className="mb-1 text-sm font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </p>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          No data yet
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <p
        className="mb-2 text-center text-sm font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </p>
      <div className="relative mx-auto" style={{ width: 160, height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name.toLowerCase()]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--text-primary)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        >
          <span
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {total}
          </span>
          <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            Total
          </span>
        </div>
      </div>
      {/* Legend */}
      <div className="mt-3 flex justify-center gap-4">
        {chartData.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[d.name.toLowerCase()] }}
            />
            <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
              {d.name} ({d.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
