import StatusBadge from "./StatusBadge";
import { FiEye, FiDownload } from "react-icons/fi";

const TeamReimbursementTable = ({ reimbursements, onUpdate }) => {
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
          No team reimbursement requests
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["Employee", "Amount", "Date", "Description", "Bill", "Status", "Actions"].map(
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
            {reimbursements.map((r) => (
              <tr
                key={r._id}
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td
                  className="whitespace-nowrap px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.user?.email}
                </td>
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
                  className="max-w-[150px] truncate px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {r.description}
                </td>
                <td className="px-4 py-3">
                  {r.billUrl ? (
                    <div className="flex items-center gap-1.5">
                      <a
                        href={r.billUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-200"
                      >
                        <FiEye size={12} />
                        View
                      </a>
                      <a
                        href={r.billUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-200"
                      >
                        <FiDownload size={12} />
                      </a>
                    </div>
                  ) : (
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      No bill
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3">
                  {r.status === "pending" && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => onUpdate(r._id, "approved")}
                        className="cursor-pointer rounded-md bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdate(r._id, "rejected")}
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

export default TeamReimbursementTable;
