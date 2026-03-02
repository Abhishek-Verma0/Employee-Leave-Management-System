import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import RoleBadge from "./RoleBadge";
import ConfirmModal from "./ConfirmModal";

const UserTable = ({ users, onUpdateRole, onDeleteUser }) => {
  const [modal, setModal] = useState({ open: false, userId: null, userName: "" });

  const openModal = (id, name) => setModal({ open: true, userId: id, userName: name });
  const closeModal = () => setModal({ open: false, userId: null, userName: "" });

  const handleConfirmDelete = () => {
    if (modal.userId) onDeleteUser(modal.userId);
    closeModal();
  };

  return (
    <>
      <ConfirmModal
        isOpen={modal.open}
        title="Delete User"
        message={`Are you sure you want to delete "${modal.userName}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={closeModal}
      />

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
                {["Name", "Email", "Role", "Actions", "Delete"].map((h) => (
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
                          <option value="pending">Approval Pending</option>
                        )}
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => openModal(u._id, u.name)}
                        title="Delete user"
                        className="flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition-colors"
                        style={{
                          backgroundColor: "rgba(239,68,68,0.12)",
                          color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.25)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.12)")
                        }
                      >
                        <FiTrash2 size={13} />
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default UserTable;
