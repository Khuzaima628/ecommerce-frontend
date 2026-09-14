import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { orderApi } from "../../lib/orderApi.js";
import { ApiError } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { money, shortDate } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperCard from "../../components/paper/PaperCard.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperModal from "../../components/paper/PaperModal.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import StatusStamp from "../../components/common/StatusStamp.jsx";
import PaperStepper from "../../components/paper/PaperStepper.jsx";

export default function CustomerOrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [pendingCancel, setPendingCancel] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    setLoadError("");
    orderApi
      .list()
      .then((data) => setOrders(data))
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : "Could not load your orders."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const confirmCancel = async () => {
    setBusy(true);
    try {
      const updated = await orderApi.cancel(pendingCancel._id);
      setOrders((prev) => prev.map((o) => (o._id === pendingCancel._id ? { ...o, ...updated } : o)));
      toast(`${pendingCancel._id} cancelled`, { tone: "warning" });
      setPendingCancel(null);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not cancel that order.", { tone: "warning" });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PaperSpinner label="fetching the spike…" />
      </div>
    );
  }

  return (
    <div>
      <PaperHeader
        eyebrow="the spike"
        title="Order history"
        description="Every docket you've filed, newest at the top."
      />

      {loadError && (
        <p role="alert" className="mb-4 font-hand text-lg text-ink-red">
          ↳ {loadError}
        </p>
      )}

      {orders.length === 0 ? (
        <PaperEmptyState
          title="No orders on the spike yet"
          hint="Once you place an order it will be filed here with its stamp."
          action={
            <PaperButton as={Link} to="/customer/products" variant="stamp">
              Browse the catalog
            </PaperButton>
          }
        />
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => (
            <li key={order._id} className="animate-paper-in">
              <PaperCard tiltId={order._id} layered foldCorner className="bg-paper-1">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-paper-edge pb-3">
                  <div>
                    <p className="font-display text-lg text-ink-1">{order._id}</p>
                    <p className="text-xs uppercase tracking-widest text-ink-faint">
                      {shortDate(order.createdAt)}
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
                  {order.items.map((l) => (
                    <li key={l.productId} className="flex flex-wrap justify-between gap-2 py-2">
                      <span className="text-sm text-ink-2">
                        {l.productName} <span className="text-ink-faint">× {l.quantity}</span>
                      </span>
                      <span className="text-sm text-ink-1">{money(l.price * l.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-dashed border-paper-edge pt-4">
                  <PaperStepper
                    order={order}
                    role="customer"
                    onCancel={() => setPendingCancel(order)}
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
                  <p className="font-display text-xl text-ink-1">
                    Total {money(order.totalAmount)}
                  </p>
                </div>
              </PaperCard>
            </li>
          ))}
        </ul>
      )}

      <PaperModal
        open={Boolean(pendingCancel)}
        onClose={() => !busy && setPendingCancel(null)}
        tone="warning"
        title="Cancel this order?"
        description={
          pendingCancel
            ? `${pendingCancel._id} will be struck through and the stock returned to the shelf.`
            : ""
        }
        footer={
          <>
            <PaperButton disabled={busy} onClick={() => setPendingCancel(null)}>
              Keep the order
            </PaperButton>
            <PaperButton variant="danger" disabled={busy} onClick={confirmCancel}>
              {busy ? "Cancelling…" : "Yes, cancel it"}
            </PaperButton>
          </>
        }
      >
        <p className="font-hand text-xl leading-snug text-ink-red">
          This cannot be undone — you would need to place a fresh order.
        </p>
        {busy && (
          <div className="mt-3">
            <PaperSpinner label="striking through…" />
          </div>
        )}
      </PaperModal>
    </div>
  );
}
