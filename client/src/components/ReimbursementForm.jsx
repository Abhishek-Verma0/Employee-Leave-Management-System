import { useState } from "react";
import { FiPlus, FiX, FiUpload } from "react-icons/fi";

const ReimbursementForm = ({ onSubmit }) => {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [description, setDescription] = useState("");
  const [billFile, setBillFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("amount", Number(amount));
    formData.append("expenseDate", expenseDate);
    formData.append("description", description);
    if (billFile) {
      formData.append("bill", billFile);
    }
    await onSubmit(formData);
    setShow(false);
    setAmount("");
    setExpenseDate("");
    setDescription("");
    setBillFile(null);
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
          {show ? "Cancel" : "Apply Reimbursement"}
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
            Apply for Reimbursement
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                className="mb-1 block text-xs font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
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
                Expense Date
              </label>
              <input
                type="date"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
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
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <div className="mt-3">
            <label
              className="mb-1 block text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Bill (optional — image or PDF)
            </label>
            <div className="flex items-center gap-2">
              <label
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                }}
              >
                <FiUpload size={12} />
                {billFile ? billFile.name : "Choose file"}
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setBillFile(e.target.files[0] || null)}
                  className="hidden"
                />
              </label>
              {billFile && (
                <button
                  type="button"
                  onClick={() => setBillFile(null)}
                  className="cursor-pointer text-xs font-medium text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
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

export default ReimbursementForm;
