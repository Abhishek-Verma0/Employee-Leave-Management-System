import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import ErrorAlert from "../components/ErrorAlert";
import SummaryCard from "../components/SummaryCard";
import TabBar from "../components/TabBar";
import LeaveForm from "../components/LeaveForm";
import ReimbursementForm from "../components/ReimbursementForm";
import LeaveTable from "../components/LeaveTable";
import ReimbursementTable from "../components/ReimbursementTable";

const tabs = [
  { key: "leaves", label: "Leaves" },
  { key: "reimbursements", label: "Reimbursements" },
];

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [activeTab, setActiveTab] = useState("leaves");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lRes, rRes] = await Promise.all([
        api.get("/api/leave/getLeaves"),
        api.get("/api/reimbursement/getReimbursement"),
      ]);
      setLeaves(lRes.data);
      setReimbursements(rRes.data);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyLeave = async (data) => {
    try {
      await api.post("/api/leave/applyLeave", data);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply leave");
    }
  };

  const handleApplyReimb = async (data) => {
    try {
      await api.post("/api/reimbursement/applyReimbursement", data);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply reimbursement");
    }
  };

  const countByStatus = (arr, s) => arr.filter((x) => x.status === s).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <PageHeader title={`Welcome, ${user?.name}`} subtitle="Employee Dashboard" />
      <ErrorAlert message={error} />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard icon={<FiCalendar size={18} />} count={leaves.length} label="Total Leaves" />
        <SummaryCard icon={<FiClock size={18} />} count={countByStatus(leaves, "pending")} label="Pending" />
        <SummaryCard icon={<FiCheckCircle size={18} />} count={countByStatus(leaves, "approved")} label="Approved" />
        <SummaryCard icon={<FiXCircle size={18} />} count={countByStatus(leaves, "rejected")} label="Rejected" />
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "leaves" && <LeaveForm onSubmit={handleApplyLeave} />}
      {activeTab === "reimbursements" && <ReimbursementForm onSubmit={handleApplyReimb} />}

      {loading ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Loading...
        </p>
      ) : activeTab === "leaves" ? (
        <LeaveTable leaves={leaves} />
      ) : (
        <ReimbursementTable reimbursements={reimbursements} />
      )}
    </div>
  );
};

export default EmployeeDashboard;
