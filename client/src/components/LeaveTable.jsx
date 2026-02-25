import StatusBadge from "./StatusBadge";

const LeaveTable = ({ leaves }) => {
  return (
    <div
      className="overflow-x-auto rounded-xl border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {leaves.length === 0 ? (
        <p
          className="px-4 py-8 text-center text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          No leave applications yet
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["From", "To", "Reason", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-semibold uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr
                key={l._id}
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td
                  className="whitespace-nowrap px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date(l.fromDate).toLocaleDateString()}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date(l.toDate).toLocaleDateString()}
                </td>
                <td
                  className="max-w-[200px] truncate px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {l.reason}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={l.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeaveTable;
