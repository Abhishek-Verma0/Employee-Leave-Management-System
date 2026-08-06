import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PendingApprovalPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-4 py-8">
      <div
        className="w-full max-w-md rounded-xl border p-8 text-center"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border-color)",
        }}
      >
        <h1
          className="mb-4 text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Account Pending Approval
        </h1>
        <p
          className="mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Your account has been created successfully, but it requires administrator approval before you can access the dashboard. Please check back later.
        </p>
        <button
          onClick={handleLogout}
          className="cursor-pointer rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: "#6366f1" }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
