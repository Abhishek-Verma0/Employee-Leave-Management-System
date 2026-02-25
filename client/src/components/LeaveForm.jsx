import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

const LeaveForm = ({ onSubmit }) => {
  const [show, setShow] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit({ fromDate, toDate, reason });
    setShow(false);
    setFromDate("");
    setToDate("");
    setReason("");
  };

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => setShow(!show)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ backgroundColor: "#6366f1" }}
        >
          {show ? <FiX size={14} /> : <FiPlus size={14} />}
          {show ? "Cancel" : "Apply Leave"}
        </button>
      </div>

      {show && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 rounded-xl border p-4"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-color)",
          }}
        >
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Apply for Leave
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                className="mb-1 block text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <div>
              <label
                className="mb-1 block text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              />
            </div>
          </div>
          <div className="mt-3">
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={2}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <button
            type="submit"
            className="mt-3 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "#6366f1" }}
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
};

export default LeaveForm;
