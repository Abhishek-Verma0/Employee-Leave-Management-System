import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { FiClock, FiCheckCircle, FiXCircle, FiCalendar, FiDollarSign, FiUmbrella } from "react-icons/fi";
import PageHeader from "../components/PageHeader";
import SummaryCard from "../components/SummaryCard";
import StatusChart from "../components/StatusChart";
import TabBar from "../components/TabBar";
import LeaveForm from "../components/LeaveForm";
import ReimbursementForm from "../components/ReimbursementForm";
import LeaveTable from "../components/LeaveTable";
import ReimbursementTable from "../components/ReimbursementTable";
import LeaveCalendar from "../components/LeaveCalendar";

const tabs = [
  { key: "leaves", label: "Leaves" },
  { key: "reimbursements", label: "Reimbursements" },
];

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);

  const [activeTab, setActiveTab] = useState("leaves");
  const [loading, setLoading] = useState(true);

  // ✅ Separate pagination states
  const [leavePage, setLeavePage] = useState(1);
  const [leaveTotalPages, setLeaveTotalPages] = useState(1);

  const [reimbPage, setReimbPage] = useState(1);
  const [reimbTotalPages, setReimbTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lRes, rRes, bRes] = await Promise.allSettled([
        api.get(`/api/leave/getLeaves?page=${leavePage}&limit=5`),
        api.get(`/api/reimbursement/getReimbursement?page=${reimbPage}&limit=5`),
        api.get("/api/leave/balance"),
      ]);

      if (lRes.status === "fulfilled") {
        setLeaves(lRes.value.data.data);
        setLeaveTotalPages(lRes.value.data.totalPages);
      }

      if (rRes.status === "fulfilled") {
        setReimbursements(rRes.value.data.data);
        setReimbTotalPages(rRes.value.data.totalPages);
      }

      setLeaveBalance(bRes.status === "fulfilled" ? bRes.value.data : null);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [leavePage, reimbPage]);

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

  const isLeaves = activeTab === "leaves";
  const currentData = isLeaves ? leaves : reimbursements;
  const currentStats = isLeaves ? leaveStats : reimbStats;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <PageHeader title={`Welcome, ${user?.name}`} subtitle="Employee Dashboard" />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Leave Balance */}
      {isLeaves && leaveBalance && (
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <SummaryCard icon={<FiUmbrella size={18} />} count={leaveBalance.remainingLeaveDays} label="Remaining Leave Days" />
          <SummaryCard icon={<FiCalendar size={18} />} count={leaveBalance.totalLeaveDays} label="Total Leave Days" />
          <SummaryCard icon={<FiCheckCircle size={18} />} count={leaveBalance.usedLeaveDays} label="Used Leave Days" />
        </div>
      )}

      {/* Tables */}
      {loading ? (
        <p className="py-8 text-center text-sm">Loading...</p>
      ) : isLeaves ? (
        <>
          <LeaveTable leaves={leaves} />

          {/* ✅ Pagination */}
          <div className="flex justify-center gap-4 mt-4">
            <button disabled={leavePage === 1} onClick={() => setLeavePage(p => p - 1)}>
              Prev
            </button>
            <span>Page {leavePage} / {leaveTotalPages}</span>
            <button disabled={leavePage === leaveTotalPages} onClick={() => setLeavePage(p => p + 1)}>
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <ReimbursementTable
            reimbursements={reimbursements}
            onUpdateBill={handleUpdateBill}
            onDeleteBill={handleDeleteBill}
          />

          {/* ✅ Pagination */}
          <div className="flex justify-center gap-4 mt-4">
            <button disabled={reimbPage === 1} onClick={() => setReimbPage(p => p - 1)}>
              Prev
            </button>
            <span>Page {reimbPage} / {reimbTotalPages}</span>
            <button disabled={reimbPage === reimbTotalPages} onClick={() => setReimbPage(p => p + 1)}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default EmployeeDashboard;