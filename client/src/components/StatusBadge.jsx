const StatusBadge = ({ status }) => {
  const colors = {
    pending: { bg: "#fef3c7", text: "#92400e" },
    approved: { bg: "#d1fae5", text: "#065f46" },
    rejected: { bg: "#fee2e2", text: "#991b1b" },
  };
  const c = colors[status] || colors.pending;
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
