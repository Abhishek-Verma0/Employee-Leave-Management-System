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
import LeaveCalendar from "../components/LeaveCalendar";

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

  // ✅ Pagination states
  const [myLeavePage, setMyLeavePage] = useState(1);
  const [myLeaveTotal, setMyLeaveTotal] = useState(1);

  const [myReimbPage, setMyReimbPage] = useState(1);
  const [myReimbTotal, setMyReimbTotal] = useState(1);

  const [teamLeavePage, setTeamLeavePage] = useState(1);
  const [teamLeaveTotal, setTeamLeaveTotal] = useState(1);

  const [teamReimbPage, setTeamReimbPage] = useState(1);
  const [teamReimbTotal, setTeamReimbTotal] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ml, mr, tl, tr] = await Promise.allSettled([
        api.get(`/api/leave/getLeaves?page=${myLeavePage}&limit=5`),
        api.get(`/api/reimbursement/getReimbursement?page=${myReimbPage}&limit=5`),
        api.get(`/api/leave/getAllLeaves?page=${teamLeavePage}&limit=5`),
        api.get(`/api/reimbursement/getAllReimbursement?page=${teamReimbPage}&limit=5`),
      ]);

      if (ml.status === "fulfilled") {
        setMyLeaves(ml.value.data.data);
        setMyLeaveTotal(ml.value.data.totalPages);
      }

      if (mr.status === "fulfilled") {
        setMyReimbursements(mr.value.data.data);
        setMyReimbTotal(mr.value.data.totalPages);
      }

      if (tl.status === "fulfilled") {
        setTeamLeaves(tl.value.data.data);
        setTeamLeaveTotal(tl.value.data.totalPages);
      }

      if (tr.status === "fulfilled") {
        setTeamReimb(tr.value.data.data);
        setTeamReimbTotal(tr.value.data.totalPages);
      }
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myLeavePage, myReimbPage, teamLeavePage, teamReimbPage]);

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

  const isLeaveTab = activeTab.includes("leaves");

  const renderPagination = () => {
    let page, total, setPage;

    switch (activeTab) {
      case "my-leaves":
        page = myLeavePage; total = myLeaveTotal; setPage = setMyLeavePage;
        break;
      case "my-reimbursements":
        page = myReimbPage; total = myReimbTotal; setPage = setMyReimbPage;
        break;
      case "team-leaves":
        page = teamLeavePage; total = teamLeaveTotal; setPage = setTeamLeavePage;
        break;
      case "team-reimbursements":
        page = teamReimbPage; total = teamReimbTotal; setPage = setTeamReimbPage;
        break;
      default:
        return null;
    }

    return (
      <div className="flex justify-center gap-4 mt-4">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>Page {page} / {total}</span>
        <button disabled={page === total} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <p className="text-center py-6">Loading...</p>;

    switch (activeTab) {
      case "my-leaves":
      return (
       <>
        <LeaveCalendar leaves={myLeaves} />
        <LeaveTable leaves={myLeaves} />
       </>
       );

      case "my-reimbursements":
        return <ReimbursementTable reimbursements={myReimbursements} onUpdateBill={handleUpdateBill} onDeleteBill={handleDeleteBill} />;
      case "team-leaves":
        return <TeamLeaveTable leaves={teamLeaves} onUpdate={handleUpdateLeave} currentUserRole={user?.role} />;
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
      
      <div className="mb-4">
        {activeTab === "my-leaves" && <LeaveForm onSubmit={handleApplyLeave} />}
        {activeTab === "my-reimbursements" && <ReimbursementForm onSubmit={handleApplyReimb} />}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-5">
        <div className="col-span-1 grid grid-cols-2 gap-3 sm:col-span-3">
          <SummaryCard icon={isLeaveTab ? <FiCalendar size={18} /> : <FiDollarSign size={18} />} count={activeData.length} label="Total" />
          <SummaryCard icon={<FiClock size={18} />} count={activeStats.pending} label="Pending" />
          <SummaryCard icon={<FiCheckCircle size={18} />} count={activeStats.approved} label="Approved" />
          <SummaryCard icon={<FiXCircle size={18} />} count={activeStats.rejected} label="Rejected" />
        </div>
        <div className="col-span-1 sm:col-span-2">
          <StatusChart title={isLeaveTab ? "Leave Status" : "Reimbursement Status"} data={activeStats} />
        </div>
      </div>

      {renderContent()}
      {renderPagination()}
    </div>
  );
};

export default ManagerDashboard;