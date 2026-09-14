import { useEffect, useState } from "react";
import { adminApi } from "../../lib/adminApi.js";
import { useToast } from "../../context/ToastContext.jsx";
import { money } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperTable from "../../components/paper/PaperTable.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import PaperInput, { PaperSelect } from "../../components/paper/PaperInput.jsx";

const CATEGORIES = ["stationary", "books", "art_supplies", "home_goods", "apparel"];

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    setLoading(true);
    adminApi.products({ search, category })
      .then((data) => setProducts(data ?? []))
      .catch((err) => toast(err.message, { tone: "warning" }))
      .finally(() => setLoading(false));
  }, [search, category]);

  const columns = [
    { key: "name", header: "Product", render: (p) => <span className="font-display">{p.productName}</span> },
    { key: "sku", header: "SKU", render: (p) => <span className="text-ink-faint">{p.sku ?? "—"}</span> },
    { key: "category", header: "Category", render: (p) => <PaperBadge tone="kraft">{p.category}</PaperBadge> },
    { key: "price", header: "Price", render: (p) => money(p.price) },
    { key: "stock", header: "Stock", render: (p) => p.stock },
    { key: "visibility", header: "Visibility", render: (p) => (
      <PaperBadge tone={p.isHidden ? "red" : "green"}>{p.isHidden ? "hidden" : "active"}</PaperBadge>
    )},
  ];

  return (
    <div>
      <PaperHeader eyebrow="the whole floor" title="All products" />
      <PaperPanel>
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <PaperInput
            label="Search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
          <PaperSelect label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </PaperSelect>
        </div>

        {loading ? <PaperSpinner /> : products.length === 0 ? (
          <PaperEmptyState title="No products match" hint="Clear the search or pick another category." />
        ) : (
          <PaperTable caption="All products" columns={columns} rows={products} keyOf={(p) => p._id} />
        )}
      </PaperPanel>
    </div>
  );
}
