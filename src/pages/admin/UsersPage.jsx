import { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { shortDate } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperTable from "../../components/paper/PaperTable.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import { PaperSelect } from "../../components/paper/PaperInput.jsx";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("all");

  useEffect(() => {
    setLoading(true);
    adminApi.users(role)
      .then((data) => setUsers(data ?? []))
      .catch((err) => toast(err.message, { tone: "warning" }))
      .finally(() => setLoading(false));
  }, [role]);

  const columns = [
    { key: "name", header: "Name", render: (u) => <span className="font-display">{u.name}</span> },
    { key: "email", header: "Email", render: (u) => <span className="text-ink-faint">{u.email}</span> },
    { key: "role", header: "Role", render: (u) => <PaperBadge tone="kraft">{u.role}</PaperBadge> },
    { key: "verified", header: "Verified", render: (u) => (
      <PaperBadge tone={u.isVerified ? "green" : "orange"}>{u.isVerified ? "verified" : "unverified"}</PaperBadge>
    )},
    { key: "joined", header: "Joined", render: (u) => shortDate(u.createdAt) },
  ];

  return (
    <div>
      <PaperHeader
        eyebrow="the register"
        title="People on the floor"
        actions={
          <div className="w-44">
            <PaperSelect label="Filter by role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="all">All roles</option>
              <option value="seller">Seller</option>
              <option value="customer">Customer</option>
            </PaperSelect>
          </div>
        }
      />

      <PaperPanel>
        {loading ? <PaperSpinner /> : users.length === 0 ? (
          <PaperEmptyState title="No one matches that filter" hint="Try another role." />
        ) : (
          <PaperTable caption="Users" columns={columns} rows={users} keyOf={(u) => u._id} />
        )}
      </PaperPanel>
    </div>
  );
}
