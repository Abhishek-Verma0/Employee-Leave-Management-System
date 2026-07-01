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

  // ✅ Pagination states
  const [leavePage, setLeavePage] = useState(1);
  const [leaveTotal, setLeaveTotal] = useState(1);

  const [reimbPage, setReimbPage] = useState(1);
  const [reimbTotal, setReimbTotal] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, lRes, rRes] = await Promise.allSettled([
        api.get("/api/user/getUsers"),
        api.get(`/api/leave/getAllLeaves?page=${leavePage}&limit=5`),
        api.get(`/api/reimbursement/getAllReimbursement?page=${reimbPage}&limit=5`),
      ]);

      if (uRes.status === "fulfilled") {
        setUsers(uRes.value.data.user || []);
      }

      if (lRes.status === "fulfilled") {
        setAllLeaves(lRes.value.data.data);
        setLeaveTotal(lRes.value.data.totalPages);
      }

      if (rRes.status === "fulfilled") {
        setAllReimb(rRes.value.data.data);
        setReimbTotal(rRes.value.data.totalPages);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [leavePage, reimbPage]);

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

  const renderPagination = () => {
    if (activeTab === "leaves") {
      return (
        <div className="flex justify-center gap-4 mt-4">
          <button disabled={leavePage === 1} onClick={() => setLeavePage(p => p - 1)}>Prev</button>
          <span>Page {leavePage} / {leaveTotal}</span>
          <button disabled={leavePage === leaveTotal} onClick={() => setLeavePage(p => p + 1)}>Next</button>
        </div>
      );
    }

    if (activeTab === "reimbursements") {
      return (
        <div className="flex justify-center gap-4 mt-4">
          <button disabled={reimbPage === 1} onClick={() => setReimbPage(p => p - 1)}>Prev</button>
          <span>Page {reimbPage} / {reimbTotal}</span>
          <button disabled={reimbPage === reimbTotal} onClick={() => setReimbPage(p => p + 1)}>Next</button>
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (loading) return <p className="text-center py-6">Loading...</p>;

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

      <div className="mb-6 grid grid-cols-3 gap-3">
        <SummaryCard icon={<FiUsers size={18} />} count={users.length} label="Total Users" />
        <SummaryCard icon={<FiCalendar size={18} />} count={allLeaves.length} label="Leave Requests" />
        <SummaryCard icon={<FiDollarSign size={18} />} count={allReimb.length} label="Reimbursements" />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatusChart title="Leave Requests" data={leaveStats} />
        <StatusChart title="Reimbursement Claims" data={reimbStats} />
      </div>

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {renderContent()}
      {renderPagination()}
    </div>
  );
};

export default AdminDashboard;