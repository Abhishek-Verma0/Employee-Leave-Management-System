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
import TeamLeaveTable from "../components/TeamLeaveTable";
import TeamReimbursementTable from "../components/TeamReimbursementTable";

const tabs = [
  { key: "my-leaves", label: "My Leaves" },
  { key: "my-reimbursements", label: "My Reimbursements" },
  { key: "team-leaves", label: "Team Leaves" },
  { key: "team-reimbursements", label: "Team Reimbursements" },
];

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-leaves");
  const [loading, setLoading] = useState(true);

  const [myLeaves, setMyLeaves] = useState([]);
  const [myReimbursements, setMyReimbursements] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [teamReimb, setTeamReimb] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ml, mr, tl, tr] = await Promise.all([
        api.get("/api/leave/getLeaves"),
        api.get("/api/reimbursement/getReimbursement"),
        api.get("/api/leave/allLeaves"),
        api.get("/api/reimbursement/getAll"),
      ]);
      setMyLeaves(ml.data);
      setMyReimbursements(mr.data);
      setTeamLeaves(tl.data);
      setTeamReimb(tr.data.reimbursements || []);
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

  const handleUpdateLeave = async (id, status) => {
    try {
      await api.put(`/api/leave/updateLeave/${id}`, { status });
      toast.success(`Leave ${status} successfully`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const handleUpdateReimb = async (id, status) => {
    try {
      await api.put(`/api/reimbursement/update/${id}`, { status });
      toast.success(`Reimbursement ${status} successfully`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const countByStatus = (arr, s) => arr.filter((x) => x.status === s).length;

  // Pick the right data set based on active tab
  const getActiveData = () => {
    switch (activeTab) {
      case "my-leaves": return myLeaves;
      case "my-reimbursements": return myReimbursements;
      case "team-leaves": return teamLeaves;
      case "team-reimbursements": return teamReimb;
      default: return [];
    }
  };

  const activeData = getActiveData();
  const activeStats = {
    pending: countByStatus(activeData, "pending"),
    approved: countByStatus(activeData, "approved"),
    rejected: countByStatus(activeData, "rejected"),
  };

  const isLeaveTab = activeTab === "my-leaves" || activeTab === "team-leaves";
  const totalIcon = isLeaveTab ? <FiCalendar size={18} /> : <FiDollarSign size={18} />;
  const chartTitle = isLeaveTab ? "Leave Status" : "Reimbursement Status";
  const totalLabel = isLeaveTab ? "Total Leaves" : "Total Claims";

  const renderContent = () => {
    if (loading) {
      return (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Loading...
        </p>
      );
    }
    switch (activeTab) {
      case "my-leaves":
        return <LeaveTable leaves={myLeaves} />;
      case "my-reimbursements":
        return <ReimbursementTable reimbursements={myReimbursements} onUpdateBill={handleUpdateBill} onDeleteBill={handleDeleteBill} />;
      case "team-leaves":
        return <TeamLeaveTable leaves={teamLeaves} onUpdate={handleUpdateLeave} />;
      case "team-reimbursements":
        return <TeamReimbursementTable reimbursements={teamReimb} onUpdate={handleUpdateReimb} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <PageHeader title={`Welcome, ${user?.name}`} subtitle="Manager Dashboard" />
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Summary Cards + Chart */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div className="col-span-1 grid grid-cols-2 gap-3 sm:col-span-3 sm:grid-cols-2">
          <SummaryCard icon={totalIcon} count={activeData.length} label={totalLabel} />
          <SummaryCard icon={<FiClock size={18} />} count={activeStats.pending} label="Pending" />
          <SummaryCard icon={<FiCheckCircle size={18} />} count={activeStats.approved} label="Approved" />
          <SummaryCard icon={<FiXCircle size={18} />} count={activeStats.rejected} label="Rejected" />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <StatusChart title={chartTitle} data={activeStats} />
        </div>
      </div>

      {activeTab === "my-leaves" && <LeaveForm onSubmit={handleApplyLeave} />}
      {activeTab === "my-reimbursements" && <ReimbursementForm onSubmit={handleApplyReimb} />}

      {renderContent()}
    </div>
  );
};

export default ManagerDashboard;
