const RoleBadge = ({ role }) => {
  const colors = {
    admin: { bg: "#ede9fe", text: "#5b21b6" },
    manager: { bg: "#dbeafe", text: "#1e40af" },
    employee: { bg: "#f3f4f6", text: "#374151" },
  };
  const c = colors[role] || colors.employee;
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {role}
    </span>
  );
};

export default RoleBadge;
