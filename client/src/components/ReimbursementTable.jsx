import StatusBadge from "./StatusBadge";

const ReimbursementTable = ({ reimbursements }) => {
  return (
    <div
      className="overflow-x-auto rounded-xl border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {reimbursements.length === 0 ? (
        <p
          className="px-4 py-8 text-center text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          No reimbursement claims yet
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["Amount", "Expense Date", "Description", "Status"].map((h) => (
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
            {reimbursements.map((r) => (
              <tr
                key={r._id}
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td
                  className="whitespace-nowrap px-4 py-3 font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  ₹{r.amount}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date(r.expenseDate).toLocaleDateString()}
                </td>
                <td
                  className="max-w-[200px] truncate px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.description}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReimbursementTable;
