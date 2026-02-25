import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiCalendar,
  FiShield,
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
  FiDollarSign,
} from "react-icons/fi";

const features = [
  {
    icon: <FiCalendar size={24} />,
    title: "Leave Management",
    desc: "Apply for leaves, track status, and manage approvals seamlessly.",
  },
  {
    icon: <FiShield size={24} />,
    title: "Role-Based Access",
    desc: "Separate dashboards for employees, managers, and admins.",
  },
  {
    icon: <FiUsers size={24} />,
    title: "Team Oversight",
    desc: "Managers and admins can approve or reject requests efficiently.",
  },
  {
    icon: <FiCheckCircle size={24} />,
    title: "Status Tracking",
    desc: "Real-time tracking of pending, approved, and rejected requests.",
  },
  {
    icon: <FiDollarSign size={24} />,
    title: "Reimbursements",
    desc: "Submit and manage expense reimbursement claims with ease.",
  },
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-57px)]">
      {/* Hero */}
      <section className="px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1
            className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--text-primary)" }}
          >
            Employee Leave &{" "}
            <span style={{ color: "#6366f1" }}>Reimbursement</span> Portal
          </h1>
          <p
            className="mx-auto mb-8 max-w-xl text-base sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            A simple and efficient system to manage employee leaves, approvals,
            and expense reimbursements — all in one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <Link
                to={`/${user.role}`}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#6366f1" }}
              >
                Go to Dashboard
                <FiArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
                  style={{ backgroundColor: "#6366f1" }}
                >
                  Get Started
                  <FiArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg px-6 py-3 text-sm font-semibold transition-colors"
                  style={{
                    color: "#6366f1",
                    border: "1px solid #6366f1",
                  }}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className="mb-8 text-center text-xl font-bold sm:text-2xl"
            style={{ color: "var(--text-primary)" }}
          >
            Features
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-xl border p-5 transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div
                  className="mb-3 inline-flex rounded-lg p-2"
                  style={{
                    color: "#6366f1",
                    backgroundColor: "var(--bg-secondary)",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  className="mb-1 text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
