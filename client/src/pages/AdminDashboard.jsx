import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FiUsers, FiCalendar, FiDollarSign } from "react-icons/fi";
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

  const [leavePage, setLeavePage] = useState(1);
  const [leaveTotal, setLeaveTotal] = useState(1);

  const [reimbPage, setReimbPage] = useState(1);
  const [reimbTotal, setReimbTotal] = useState(1);

  // ✅ FIXED
  const fetchData = useCallback(async () => {
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
  }, [leavePage, reimbPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

      {loading ? (
        <p className="text-center py-6">Loading...</p>
      ) : activeTab === "users" ? (
        <UserTable users={users} />
      ) : activeTab === "leaves" ? (
        <TeamLeaveTable leaves={allLeaves} />
      ) : (
        <TeamReimbursementTable reimbursements={allReimb} />
      )}
    </div>
  );
};

export default AdminDashboard;