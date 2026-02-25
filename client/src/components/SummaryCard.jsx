const SummaryCard = ({ icon, count, label }) => {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mb-2" style={{ color: "#6366f1" }}>
        {icon}
      </div>
      <p
        className="text-xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        {count}
      </p>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        {label}
      </p>
    </div>
  );
};

export default SummaryCard;
