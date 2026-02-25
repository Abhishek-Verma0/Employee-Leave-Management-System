import StatusBadge from "./StatusBadge";

const TeamLeaveTable = ({ leaves, onUpdate }) => {
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
          No team leave requests
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["Employee", "From", "To", "Reason", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold uppercase"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {h}
                  </th>
                )
              )}
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
                  {l.user?.email}
                </td>
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
                  className="max-w-[150px] truncate px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {l.reason}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={l.status} />
                </td>
                <td className="px-4 py-3">
                  {l.status === "pending" && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onUpdate(l._id, "approved")}
                        className="cursor-pointer rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdate(l._id, "rejected")}
                        className="cursor-pointer rounded-md bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeamLeaveTable;
