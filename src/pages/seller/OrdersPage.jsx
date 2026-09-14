import { useCallback, useEffect, useState } from "react";
import { orderApi } from "../../lib/orderApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { money, shortDate } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperCard from "../../components/paper/PaperCard.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import { PaperSelect } from "../../components/paper/PaperInput.jsx";
import StatusStamp from "../../components/common/StatusStamp.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";

const UPDATABLE = ["shipped", "delivered", "cancelled"];

export default function SellerOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await orderApi.sellerOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast(err?.message ?? "Failed to load orders", { tone: "warning" });
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  async function handleStatusChange(oid, status) {
    if (!status) return;
    setUpdating(oid);
    try {
      await orderApi.updateSellerOrderStatus(oid, status);
      toast("Order status updated");
      await fetchOrders();
    } catch (err) {
      toast(err?.message ?? "Failed to update status", { tone: "warning" });
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <PaperSpinner />
      </div>
    );
  }

  return (
    <div>
      <PaperHeader
        eyebrow="the order spike"
        title="Orders for your stall"
        description="Only the lines that belong to you are shown on each docket."
      />

      {orders.length === 0 ? (
        <PaperEmptyState title="No orders on the spike" hint="Nothing to show yet." />
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => (
            <li key={order._id} className="animate-paper-in">
              <PaperCard tiltId={order._id} layered foldCorner className="bg-paper-1">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-paper-edge pb-3">
                  <div>
                    <p className="font-display text-lg text-ink-1">{order._id}</p>
                    <p className="text-xs uppercase tracking-widest text-ink-faint">
                      Customer: {order.userId?.name ?? order.userId ?? "—"} · {shortDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusStamp status={order.status} />
                    <PaperBadge tone={order.paymentStatus === "paid" ? "green" : "orange"}>
                      Payment: {order.paymentStatus}
                    </PaperBadge>
                  </div>
                </div>

                <ul className="divide-y divide-dashed divide-paper-edge">
                  {(order.items ?? []).map((item) => (
                    <li key={item.productId} className="flex flex-wrap justify-between gap-2 py-2">
                      <span className="text-sm text-ink-2">
                        {item.productName}{" "}
                        <span className="text-ink-faint">× {item.quantity}</span>
                      </span>
                      <span className="text-sm text-ink-1">
                        {money(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-paper-edge pt-4">
                  <p className="font-display text-lg text-ink-1">
                    Total {money(order.totalAmount)}
                  </p>
                  <div className="w-44">
                    <PaperSelect
                      label="Update status"
                      value=""
                      disabled={updating === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="">— change status —</option>
                      {UPDATABLE.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </PaperSelect>
                  </div>
                </div>
              </PaperCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
