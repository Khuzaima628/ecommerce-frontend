import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { orderApi } from "../../lib/orderApi.js";
import { useSession } from "../../context/SessionContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { money } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import StatusStamp from "../../components/common/StatusStamp.jsx";
import { shortDate } from "../../lib/paper.js";

export default function SellerDashboardPage() {
  const { currentUser } = useSession();
  const { toast } = useToast();
  const [dash, setDash] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orderApi.sellerDashboard(), orderApi.sellerOrders()])
      .then(([dashData, ordersData]) => {
        setDash(dashData);
        setOrders(ordersData ?? []);
      })
      .catch((err) => toast(err.message, { tone: "warning" }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PaperSpinner />;
  if (!dash) return null;

  return (
    <div>
      <PaperHeader
        eyebrow="behind the counter"
        title={currentUser.shopName ?? currentUser.name}
        description="The state of your stall today."
        actions={
          <PaperButton as={Link} to="/seller/products" variant="stamp">
            Manage products
          </PaperButton>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total products" value={dash.totalProducts} />
        <StatCard label="Total orders" value={dash.totalOrders} />
        <StatCard label="Pending orders" value={dash.pendingOrders} note="awaiting action" />
        <StatCard label="Waiting to ship" value={dash.waitingToShip} note="ready to dispatch" />
        <StatCard label="Revenue" value={money(dash.revenue)} note="paid orders only" />
        <StatCard label="Low stock" value={dash.lowStock} note="needs restocking" />
      </div>

      {dash.restockNote?.length > 0 && (
        <div className="torn-edges relative mb-6 bg-paper-2 px-5 py-4 shadow-sheet">
          <span aria-hidden="true" className="paper-grain" />
          <div className="relative">
            <p className="font-hand text-2xl leading-none text-ink-red">Restock note</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {dash.restockNote.map((item) => (
                <li key={item.productName}>
                  <PaperBadge tone={item.stock === 0 ? "red" : "orange"}>
                    {item.productName}: {item.stock} left
                  </PaperBadge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <PaperPanel
        title="Recent orders"
        actions={
          <PaperButton as={Link} to="/seller/orders" size="sm">
            All orders
          </PaperButton>
        }
      >
        {orders.length === 0 ? (
          <PaperEmptyState
            title="No orders yet"
            hint="When a customer buys one of your goods it appears here."
          />
        ) : (
          <ul className="divide-y divide-dashed divide-paper-edge">
            {orders.slice(0, 5).map((o) => (
              <li key={o._id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-display text-base text-ink-1">{o._id}</p>
                  <p className="text-xs text-ink-faint">
                    Customer: {o.userId?.name ?? o.userId ?? "—"} · {shortDate(o.createdAt)}
                  </p>
                </div>
                <StatusStamp status={o.status} />
              </li>
            ))}
          </ul>
        )}
      </PaperPanel>
    </div>
  );
}
