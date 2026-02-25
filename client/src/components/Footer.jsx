import { FiGithub, FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer
      className="mt-auto border-t px-4 py-4"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Swiftly
          </span>
          . All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Abhishek-Verma0"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <FiGithub size={16} />
          </a>
          <p className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            Made with <FiHeart size={12} className="text-red-500" /> by Abhishek
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
