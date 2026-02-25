const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1
        className="text-xl font-bold sm:text-2xl"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h1>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {subtitle}
      </p>
    </div>
  );
};

export default PageHeader;
