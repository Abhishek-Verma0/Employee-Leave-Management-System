import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiDollarSign } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import StatusChart from "../components/StatusChart";
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
      toast.error("Failed to load data");
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
      toast.success("Leave applied successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply leave");
    }
  };

  const handleApplyReimb = async (formData) => {
    try {
      await api.post("/api/reimbursement/applyReimbursement", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Reimbursement applied successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply reimbursement");
    }
  };

  const handleUpdateBill = async (id, formData) => {
    try {
      await api.put(`/api/reimbursement/updateBill/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Bill updated successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update bill");
    }
  };

  const handleDeleteBill = async (id) => {
    try {
      await api.delete(`/api/reimbursement/deleteBill/${id}`);
      toast.success("Bill deleted successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete bill");
    }
  };

  const countByStatus = (arr, s) => arr.filter((x) => x.status === s).length;

  const leaveStats = {
    pending: countByStatus(leaves, "pending"),
    approved: countByStatus(leaves, "approved"),
    rejected: countByStatus(leaves, "rejected"),
  };

  const reimbStats = {
    pending: countByStatus(reimbursements, "pending"),
    approved: countByStatus(reimbursements, "approved"),
    rejected: countByStatus(reimbursements, "rejected"),
  };

  const currentData = activeTab === "leaves" ? leaves : reimbursements;
  const currentStats = activeTab === "leaves" ? leaveStats : reimbStats;
  const totalIcon = activeTab === "leaves" ? <FiCalendar size={18} /> : <FiDollarSign size={18} />;
  const totalLabel = activeTab === "leaves" ? "Total Leaves" : "Total Claims";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <PageHeader title={`Welcome, ${user?.name}`} subtitle="Employee Dashboard" />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Summary Cards + Chart */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div className="col-span-1 grid grid-cols-2 gap-3 sm:col-span-3 sm:grid-cols-2">
          <SummaryCard icon={totalIcon} count={currentData.length} label={totalLabel} />
          <SummaryCard icon={<FiClock size={18} />} count={currentStats.pending} label="Pending" />
          <SummaryCard icon={<FiCheckCircle size={18} />} count={currentStats.approved} label="Approved" />
          <SummaryCard icon={<FiXCircle size={18} />} count={currentStats.rejected} label="Rejected" />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <StatusChart
            title={activeTab === "leaves" ? "Leave Status" : "Reimbursement Status"}
            data={currentStats}
          />
        </div>
      </div>

      {activeTab === "leaves" && <LeaveForm onSubmit={handleApplyLeave} />}
      {activeTab === "reimbursements" && <ReimbursementForm onSubmit={handleApplyReimb} />}

      {loading ? (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Loading...
        </p>
      ) : activeTab === "leaves" ? (
        <LeaveTable leaves={leaves} />
      ) : (
        <ReimbursementTable reimbursements={reimbursements} onUpdateBill={handleUpdateBill} onDeleteBill={handleDeleteBill} />
      )}
    </div>
  );
};

export default EmployeeDashboard;
