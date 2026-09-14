import { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { money, shortDate } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperTable from "../../components/paper/PaperTable.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperModal from "../../components/paper/PaperModal.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import { PaperSelect } from "../../components/paper/PaperInput.jsx";
import StatusStamp from "../../components/common/StatusStamp.jsx";

const STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    setLoading(true);
    adminApi.orders(status)
      .then((data) => setOrders(data ?? []))
      .catch((err) => toast(err.message, { tone: "warning" }))
      .finally(() => setLoading(false));
  }, [status]);

  const columns = [
    { key: "id", header: "Order", render: (o) => <span className="font-display">{o._id}</span> },
    { key: "customer", header: "Customer", render: (o) => o.userId?.name ?? o.userId ?? "—" },
    { key: "date", header: "Date", render: (o) => shortDate(o.createdAt) },
    { key: "total", header: "Total", render: (o) => money(o.totalAmount) },
    { key: "payment", header: "Payment", render: (o) => (
      <PaperBadge tone={o.paymentStatus === "paid" ? "green" : "orange"}>{o.paymentStatus}</PaperBadge>
    )},
    { key: "status", header: "Status", render: (o) => <StatusStamp status={o.status} /> },
    { key: "actions", header: "Actions", render: (o) => (
      <PaperButton size="sm" onClick={() => setOpen(o)}>Open docket</PaperButton>
    )},
  ];

  return (
    <div>
      <PaperHeader
        eyebrow="the spike"
        title="All orders"
        actions={
          <div className="w-44">
            <PaperSelect label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </PaperSelect>
          </div>
        }
      />

      <PaperPanel>
        {loading ? <PaperSpinner /> : orders.length === 0 ? (
          <PaperEmptyState title="No orders match" hint="Try another status." />
        ) : (
          <PaperTable caption="All orders" columns={columns} rows={orders} keyOf={(o) => o._id} />
        )}
      </PaperPanel>

      <PaperModal
        open={Boolean(open)}
        onClose={() => setOpen(null)}
        title={open ? `Docket ${open._id}` : ""}
        description={open ? `${open.userId?.name ?? open.userId ?? "—"} · ${shortDate(open.createdAt)}` : ""}
        footer={<PaperButton variant="stamp" onClick={() => setOpen(null)}>Close docket</PaperButton>}
      >
        {open && (
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusStamp status={open.status} />
              <PaperBadge tone={open.paymentStatus === "paid" ? "green" : "orange"}>
                Payment: {open.paymentStatus}
              </PaperBadge>
            </div>
            <ul className="divide-y divide-dashed divide-paper-edge text-sm">
              {open.items.map((l) => (
                <li key={l.productId} className="flex justify-between py-2">
                  <span className="text-ink-2">{l.productName} × {l.quantity}</span>
                  <span className="text-ink-1">{money(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-right font-display text-xl text-ink-1">
              Total {money(open.totalAmount)}
            </p>
          </div>
        )}
      </PaperModal>
    </div>
  );
}
