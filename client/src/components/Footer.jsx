import { Link } from "react-router-dom";
import {
  FiGithub,
  FiMail,
  FiArrowUp,
  FiHeart,
} from "react-icons/fi";
import {
  FaXTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer
      className="mt-10 border-t"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        
      
        <div>
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            About
          </h3>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Swiftly is a modern leave and reimbursement management system
            designed to simplify employee workflows and approvals.
          </p>
        </div>

       
        <div>
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Quick Links
          </h3>
          <div className="flex flex-col gap-2 text-xs">
            <Link to="/" className="hover:text-indigo-500">Home</Link>
            <Link to="/login" className="hover:text-indigo-500">Login</Link>
            <Link to="/register" className="hover:text-indigo-500">Register</Link>
            <Link to="/dashboard" className="hover:text-indigo-500">Dashboard</Link>
          </div>
        </div>

      
        <div>
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Contact
          </h3>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <FiMail size={14} />
              <span>your@email.com</span>
            </div>
            <a
              href="https://github.com/Abhishek-Verma0/Employee-Leave-Management-System"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-indigo-500"
            >
              <FiGithub size={14} />
              GitHub
            </a>
          </div>
        </div>

        
        <div>
          <h3
            className="mb-3 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Follow Us
          </h3>
          <div className="flex items-center gap-4 text-lg">
            <a href="#" className="hover:text-indigo-500">
              <FaXTwitter />
            </a>
            <a href="#" className="hover:text-indigo-500">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-indigo-500">
              <FaFacebook />
            </a>
          </div>
        </div>
      </div>

   
      <div
        className="flex items-center justify-between px-4 py-4 text-xs border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <p
          className="flex items-center gap-1"
          style={{ color: "var(--text-secondary)" }}
        >
          © {new Date().getFullYear()} Swiftly. Made with{" "}
          <FiHeart size={12} className="text-red-500" /> by Abhishek
        </p>

      
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1 hover:text-indigo-500"
        >
          <FiArrowUp size={14} />
          Top
        </button>
      </div>
    </footer>
  );
};

export default Footer;