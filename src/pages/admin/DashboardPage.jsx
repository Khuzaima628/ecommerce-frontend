import { useData } from "../../context/DataContext.jsx";
import { money, timeAgo } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import StatCard from "../../components/common/StatCard.jsx";

export default function AdminDashboardPage() {
  const { users, products, orders, activity, getUser } = useData();
  const revenue = orders
    .filter((o) => o.paymentStatus === "paid" && o.status !== "cancelled")
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div>
      <PaperHeader
        eyebrow="the back office"
        title="Platform ledger"
        description="Everything on the floor, counted from the shared books."
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={users.length} />
        <StatCard label="Total products" value={products.length} />
        <StatCard label="Total orders" value={orders.length} />
        <StatCard label="Revenue" value={money(revenue)} note="paid, non-cancelled" />
      </div>

      <PaperPanel title="Everything happening on the floor">
        {activity.length === 0 ? (
          <PaperEmptyState title="Nothing noted yet" hint="Seller actions get written down here." />
        ) : (
          <ul className="space-y-2">
            {activity.slice(0, 12).map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed border-paper-edge pb-2"
              >
                <span className="font-hand text-xl leading-tight text-ink-2">
                  <span className="text-kraft">{getUser(a.actorId)?.name ?? "Someone"}:</span>{" "}
                  {a.message}
                </span>
                <span className="text-xs uppercase tracking-widest text-ink-faint">
                  {timeAgo(a.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PaperPanel>
    </div>
  );
}
