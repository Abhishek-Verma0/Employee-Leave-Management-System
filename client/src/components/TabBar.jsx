const TabBar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div
      className="mb-4 flex flex-wrap gap-1 rounded-lg p-1"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className="cursor-pointer rounded-md px-3 py-2 text-xs font-medium transition-colors sm:text-sm"
          style={{
            backgroundColor: activeTab === tab.key ? "#6366f1" : "transparent",
            color: activeTab === tab.key ? "white" : "var(--text-secondary)",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
