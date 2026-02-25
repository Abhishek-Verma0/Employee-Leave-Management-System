import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { FiUsers, FiCalendar, FiDollarSign } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import ErrorAlert from "../components/ErrorAlert";
import SummaryCard from "../components/SummaryCard";
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
  const [error, setError] = useState("");

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
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRole = async (id, role) => {
    try {
      await api.put(`/api/user/updateRole/${id}`, { role });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleUpdateLeave = async (id, status) => {
    try {
      await api.put(`/api/leave/updateLeave/${id}`, { status });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update");
    }
  };

  const handleUpdateReimb = async (id, status) => {
    try {
      await api.put(`/api/reimbursement/update/${id}`, { status });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update");
    }
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
        return <UserTable users={users} onUpdateRole={handleUpdateRole} />;
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
      <ErrorAlert message={error} />

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <SummaryCard icon={<FiUsers size={18} />} count={users.length} label="Total Users" />
        <SummaryCard icon={<FiCalendar size={18} />} count={allLeaves.length} label="Leave Requests" />
        <SummaryCard icon={<FiDollarSign size={18} />} count={allReimb.length} label="Reimbursements" />
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default AdminDashboard;
