import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FiUsers, FiCalendar, FiDollarSign, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import StatusChart from "../components/StatusChart";
import TabBar from "../components/TabBar";
import UserTable from "../components/UserTable";
import TeamLeaveTable from "../components/TeamLeaveTable";
import TeamReimbursementTable from "../components/TeamReimbursementTable";

const tabs = [
  { key: "users", label: "Users" },
  { key: "leaves", label: "Leaves" },
  { key: "reimbursements", label: "Reimbursements" },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]);
  const [allReimb, setAllReimb] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, lRes, rRes] = await Promise.all([
        api.get("/api/user/getUsers"),
        api.get("/api/leave/allLeaves"),
        api.get("/api/reimbursement/getAll"),
      ]);
      setUsers(uRes.data.user || []);
      setAllLeaves(lRes.data);
      setAllReimb(rRes.data.reimbursements || []);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/api/user/deleteUser/${id}`);
      toast.success("User deleted successfully");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleUpdateRole = async (id, role) => {
    try {
      await api.put(`/api/user/updateRole/${id}`, { role });
      toast.success(`User role updated to ${role}`);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
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

  const leaveStats = {
    pending: countByStatus(allLeaves, "pending"),
    approved: countByStatus(allLeaves, "approved"),
    rejected: countByStatus(allLeaves, "rejected"),
  };

  const reimbStats = {
    pending: countByStatus(allReimb, "pending"),
    approved: countByStatus(allReimb, "approved"),
    rejected: countByStatus(allReimb, "rejected"),
  };

  const renderContent = () => {
    if (loading) {
      return (
        <p className="py-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Loading...
        </p>
      );
    }
    switch (activeTab) {
      case "users":
        return <UserTable users={users} onUpdateRole={handleUpdateRole} onDeleteUser={handleDeleteUser} />;
      case "leaves":
        return <TeamLeaveTable leaves={allLeaves} onUpdate={handleUpdateLeave} />;
      case "reimbursements":
        return <TeamReimbursementTable reimbursements={allReimb} onUpdate={handleUpdateReimb} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <PageHeader title={`Welcome, ${user?.name}`} subtitle="Admin Panel" />

      {/* Overview Summary */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <SummaryCard icon={<FiUsers size={18} />} count={users.length} label="Total Users" />
        <SummaryCard icon={<FiCalendar size={18} />} count={allLeaves.length} label="Leave Requests" />
        <SummaryCard icon={<FiDollarSign size={18} />} count={allReimb.length} label="Reimbursements" />
      </div>

      {/* Charts side-by-side */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatusChart title="Leave Requests" data={leaveStats} />
        <StatusChart title="Reimbursement Claims" data={reimbStats} />
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
