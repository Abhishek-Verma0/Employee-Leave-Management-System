import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import ErrorAlert from "../components/ErrorAlert";
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
  const [error, setError] = useState("");

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
      setError(err.response?.data?.message || "Failed");
    }
  };

  const handleApplyReimb = async (data) => {
    try {
      await api.post("/api/reimbursement/applyReimbursement", data);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed");
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
      case "my-leaves":
        return <LeaveTable leaves={myLeaves} />;
      case "my-reimbursements":
        return <ReimbursementTable reimbursements={myReimbursements} />;
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
      <ErrorAlert message={error} />
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "my-leaves" && <LeaveForm onSubmit={handleApplyLeave} />}
      {activeTab === "my-reimbursements" && <ReimbursementForm onSubmit={handleApplyReimb} />}

      {renderContent()}
    </div>
  );
};

export default ManagerDashboard;
