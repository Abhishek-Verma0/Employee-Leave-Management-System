import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer"; 

import {
  FiCalendar,
  FiShield,
  FiUsers,
  FiArrowRight,
  FiCheckCircle,
  FiDollarSign,
  FiLayers,
  FiMessageCircle,
  FiBriefcase,
  FiPhone,
  FiMail,
  FiZap,
  FiShare2,
  FiStar,
} from "react-icons/fi";

const metrics = [
  {
    icon: <FiUsers size={24} />,
    title: "Total Employees",
    value: "1,280",
  },
  {
    icon: <FiCalendar size={24} />,
    title: "Leave Requests Processed",
    value: "4,560",
  },
  {
    icon: <FiCheckCircle size={24} />,
    title: "Approval Rate",
    value: "92%",
  },
  {
    icon: <FiLayers size={24} />,
    title: "Active Departments",
    value: "14",
  },
];

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

const policies = [
  {
    title: "Clear leave policy",
    desc: "Define leave types, eligibility, and approval workflows in one place.",
  },
  {
    title: "Privacy & security",
    desc: "Secure employee records with role-based access and audit trails.",
  },
  {
    title: "Fast approvals",
    desc: "Managers can act on pending requests from any device, anytime.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Submit request",
    desc: "Employees choose leave type, dates, and reason in a single form.",
  },
  {
    step: "02",
    title: "Approve quickly",
    desc: "Managers review, approve, or request changes with one click.",
  },
  {
    step: "03",
    title: "Track status",
    desc: "Everyone sees request progress, approvals, and payout details.",
  },
];

const quickActions = [
  {
    icon: <FiZap size={24} />,
    title: "Request leave",
    desc: "Start a new leave request in seconds.",
  },
  {
    icon: <FiCheckCircle size={24} />,
    title: "Approve requests",
    desc: "Review pending approvals from managers and admins.",
  },
  {
    icon: <FiDollarSign size={24} />,
    title: "Submit reimbursement",
    desc: "Upload expenses and track reimbursement status.",
  },
  {
    icon: <FiShare2 size={24} />,
    title: "Sync with team",
    desc: "Keep teams aligned with request summaries and alerts.",
  },
];

const testimonials = [
  {
    quote: "Swiftly helped our HR team cut leave processing time in half.",
    name: "Aditi Sharma",
    role: "HR Manager",
  },
  {
    quote: "The dashboard gives managers the visibility they needed.",
    name: "Rohan Kapoor",
    role: "Operations Lead",
  },
  {
    quote: "Our employees love the simple leave request workflow.",
    name: "Nisha Patel",
    role: "Employee",
  },
];

const LandingPage = () => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-[calc(100vh-57px)]">
      {/* Hero */}
      <section id="home" className="px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h1
            className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--text-primary)" }}
          >
            <span style={{ color: "#6366f1" }}>Swiftly</span> — Leave & Reimbursement Portal
          </h1>
          <p
            className="mx-auto mb-8 max-w-xl text-base sm:text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            A modern employee management system that streamlines leave requests,
            approvals, and reimbursement workflows for teams of every size.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {user ? (
              <Link
                to={`/${user.role}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 text-sm font-semibold bg-indigo-500 text-white border border-indigo-500 transition-all duration-300 hover:bg-indigo-600 hover:shadow-md"
              >
                Go to Dashboard
                <FiArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 text-sm font-semibold bg-indigo-500 text-white border border-indigo-500 transition-all duration-300 ease-out hover:bg-indigo-600 hover:shadow-md hover:scale-[1.02]"
                >
                  Get Started
                  <FiArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3 text-sm font-semibold border border-indigo-500 bg-transparent text-indigo-500 transition-all duration-300 ease-out hover:bg-[var(--bg-secondary)] hover:shadow-sm"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="px-4 pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-500">Quick stats</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Employee management at a glance
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <article
                key={metric.title}
                className="group rounded-3xl border border-transparent bg-[var(--bg-card)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div
                  className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl"
                  style={{
                    color: "#6366f1",
                    backgroundColor: "rgba(99,102,241,0.12)",
                  }}
                >
                  {metric.icon}
                </div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                  {metric.title}
                </p>
                <p className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
                  {metric.value}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 pb-16">
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
                className="rounded-xl border p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border-color)",
                  boxShadow: "0 0 0 rgba(0,0,0,0)",
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
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 pb-16 bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-500">How it works</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Simplified workflow for every request
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {howItWorks.map((step) => (
              <div
                key={step.step}
                className="rounded-3xl border border-indigo-100 bg-[var(--bg-card)] p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white text-lg font-bold">
                  {step.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-500">Quick actions</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              One-click access to the tasks you use most
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className="group rounded-3xl border border-transparent bg-[var(--bg-card)] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div
                  className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-3xl"
                  style={{
                    color: "#6366f1",
                    backgroundColor: "rgba(99,102,241,0.12)",
                  }}
                >
                  {action.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  {action.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {action.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 pb-16 bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-500">Testimonials</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Trusted by teams across the organization
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-indigo-100 bg-[var(--bg-card)] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <FiStar size={20} className="mb-4 text-indigo-500" />
                <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  “{item.quote}”
                </p>
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {item.name}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {item.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies */}
      <section id="policies" className="px-4 pb-16 bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-indigo-100 bg-blue/80 p-8 shadow-xl backdrop-blur-sm sm:p-12">
          <div className="mb-10 text-center ">
            <p className="text-sm uppercase tracking-[0.24em] text-indigo-500">Policies</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
              Transparent company policies, easy to follow
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {policies.map((policy) => (
              <div
                key={policy.title}
                className="rounded-3xl border border-indigo-100 bg-[var(--bg-card)] p-6 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="mb-3 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                  {policy.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {policy.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-500">About Swiftly</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
                Built to simplify HR workflows for every team.
              </h2>
              <p className="mt-5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Our ready-to-use dashboard offers leave tracking, approval routing, and reimbursement management without the complexity.
                Employees stay informed, managers stay in control, and admins get clear visibility.
              </p>
            </div>

            <div className="rounded-3xl border border-indigo-100 bg-[var(--bg-card)] p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <FiBriefcase size={28} className="text-indigo-500" />
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                    Reliable for fast-moving teams
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Stay aligned with policy, speed approvals, and reduce manual follow-ups.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-4 pb-16 bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-indigo-100 bg-blue/80 p-8 shadow-xl backdrop-blur-sm sm:p-12">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-500">Contact</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
                Let’s get you set up with a better process.
              </h2>
              <p className="mt-5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Reach out for a demo, ask about deployment, or get support for your team.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-3xl border border-indigo-100 bg-[var(--bg-card)] p-5">
                <FiMail size={24} className="text-indigo-500" />
                <div>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Email</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>support@swiftlyapp.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-3xl border border-indigo-100 bg-[var(--bg-card)] p-5">
                <FiPhone size={24} className="text-indigo-500" />
                <div>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Phone</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-3xl border border-indigo-100 bg-[var(--bg-card)] p-5">
                <FiMessageCircle size={24} className="text-indigo-500" />
                <div>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Message</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Start a conversation anytime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;