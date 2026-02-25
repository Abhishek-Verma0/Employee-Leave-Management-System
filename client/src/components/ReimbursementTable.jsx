import { useState, useRef } from "react";
import StatusBadge from "./StatusBadge";
import { FiEye, FiUpload, FiTrash2 } from "react-icons/fi";

const ReimbursementTable = ({ reimbursements, onUpdateBill, onDeleteBill }) => {
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingId) return;
    const formData = new FormData();
    formData.append("bill", file);
    await onUpdateBill(uploadingId, formData);
    setUploadingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerUpload = (id) => {
    setUploadingId(id);
    fileInputRef.current?.click();
  };

  return (
    <div
      className="overflow-x-auto rounded-xl border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Hidden file input for bill upload/replace */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

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
              {["Amount", "Expense Date", "Description", "Bill", "Status"].map((h) => (
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
                      {r.status === "pending" && (
                        <>
                          <button
                            onClick={() => triggerUpload(r._id)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 transition-colors hover:bg-amber-200"
                          >
                            <FiUpload size={12} />
                            Replace
                          </button>
                          <button
                            onClick={() => onDeleteBill(r._id)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        No bill
                      </span>
                      {r.status === "pending" && (
                        <button
                          onClick={() => triggerUpload(r._id)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-200"
                        >
                          <FiUpload size={12} />
                          Upload
                        </button>
                      )}
                    </div>
                  )}
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
