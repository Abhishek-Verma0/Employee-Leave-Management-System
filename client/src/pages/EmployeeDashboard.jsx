import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

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
  { key: "leaves", label: "My Leaves" },
  { key: "reimbursements", label: "My Reimbursements" },
];

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("leaves");
  const [loading, setLoading] = useState(true);

  const [leaves, setLeaves] = useState([]);
  const [reimbursements, setReimbursements] = useState([]);


  const [leavePage, setLeavePage] = useState(1);
  const [leaveTotal, setLeaveTotal] = useState(1);

  const [reimbPage, setReimbPage] = useState(1);
  const [reimbTotal, setReimbTotal] = useState(1);


  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lRes, rRes] = await Promise.allSettled([
        api.get(`/api/leave/getLeaves?page=${leavePage}&limit=5`),
        api.get(`/api/reimbursement/getReimbursement?page=${reimbPage}&limit=5`),
      ]);

      if (lRes.status === "fulfilled") {
        setLeaves(lRes.value.data.data);
        setLeaveTotal(lRes.value.data.totalPages);
      }

      if (rRes.status === "fulfilled") {
        setReimbursements(rRes.value.data.data);
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

  const countByStatus = (arr, s) =>
    arr.filter((x) => x.status === s).length;

 
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

  const isLeaveTab = activeTab === "leaves";

  const renderPagination = () => {
    if (activeTab === "leaves") {
      return (
        <div className="flex justify-center gap-4 mt-4">
          <button disabled={leavePage === 1} onClick={() => setLeavePage(p => p - 1)}>
            Prev
          </button>
          <span>Page {leavePage} / {leaveTotal}</span>
          <button disabled={leavePage === leaveTotal} onClick={() => setLeavePage(p => p + 1)}>
            Next
          </button>
        </div>
      );
    }

    if (activeTab === "reimbursements") {
      return (
        <div className="flex justify-center gap-4 mt-4">
          <button disabled={reimbPage === 1} onClick={() => setReimbPage(p => p - 1)}>
            Prev
          </button>
          <span>Page {reimbPage} / {reimbTotal}</span>
          <button disabled={reimbPage === reimbTotal} onClick={() => setReimbPage(p => p + 1)}>
            Next
          </button>
        </div>
      );
    }

    return null;
  };

  const renderContent = () => {
    if (loading) return <p className="text-center py-6">Loading...</p>;

    if (activeTab === "leaves") {
      return (
        <>
          <LeaveForm onSuccess={fetchData} />
          <LeaveCalendar leaves={leaves} />
          <LeaveTable leaves={leaves} />
        </>
      );
    }

    return (
      <>
        <ReimbursementForm onSuccess={fetchData} />
        <ReimbursementTable reimbursements={reimbursements} />
      </>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <PageHeader title={`Welcome, ${user?.name}`} subtitle="Employee Dashboard" />

      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

  
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div className="col-span-1 grid grid-cols-2 gap-3 sm:col-span-3">
          <SummaryCard
            icon={isLeaveTab ? <FiCalendar size={18} /> : <FiDollarSign size={18} />}
            count={isLeaveTab ? leaves.length : reimbursements.length}
            label="Total"
          />
          <SummaryCard icon={<FiClock size={18} />} count={isLeaveTab ? leaveStats.pending : reimbStats.pending} label="Pending" />
          <SummaryCard icon={<FiCheckCircle size={18} />} count={isLeaveTab ? leaveStats.approved : reimbStats.approved} label="Approved" />
          <SummaryCard icon={<FiXCircle size={18} />} count={isLeaveTab ? leaveStats.rejected : reimbStats.rejected} label="Rejected" />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <StatusChart
            title={isLeaveTab ? "Leave Status" : "Reimbursement Status"}
            data={isLeaveTab ? leaveStats : reimbStats}
          />
        </div>
      </div>

      {renderContent()}
      {renderPagination()}
    </div>
  );
};

export default EmployeeDashboard;