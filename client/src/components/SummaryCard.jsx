const SummaryCard = ({ icon, count, label }) => {
  return (
    <div className="flex flex-col rounded-xl border px-2 py-4"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}>
      <div className="flex flex-col justify-center items-center">

        <div className="mb-2" style={{ color: "#6366f1" }}>
          {icon}
        </div>

        <p
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {count}
        </p>

      </div>
      <div>
        <p className="text-xs text-center wrap-break-word" style={{ color: "var(--text-secondary)" }}>
          {label}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
