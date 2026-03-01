import RoleBadge from "./RoleBadge";

const UserTable = ({ users, onUpdateRole }) => {
  return (
    <div
      className="overflow-x-auto rounded-xl border"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {users.length === 0 ? (
        <p
          className="px-4 py-8 text-center text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          No users
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
              {["Name", "Email", "Role", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-xs font-semibold uppercase"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                style={{ borderBottom: "1px solid var(--border-color)" }}
              >
                <td
                  className="whitespace-nowrap px-4 py-3 font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {u.name}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {u.email}
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={u.role} />
                </td>
                <td className="px-4 py-3">
                  {u.role !== "admin" && (
                    <select
                      value={u.role}
                      onChange={(e) => onUpdateRole(u._id, e.target.value)}
                      className="cursor-pointer rounded-lg border px-2 py-1 text-xs outline-none"
                      style={{
                        borderColor: "var(--border-color)",
                        backgroundColor: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {u.role === "Approval-Pending" && (
                        <option  value="pending">Approval Pending</option>
                      )}
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserTable;
