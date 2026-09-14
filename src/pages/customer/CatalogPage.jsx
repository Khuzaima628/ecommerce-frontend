import { useEffect, useState } from "react";
import { productApi } from "../../lib/productApi.js";
import { ApiError } from "../../lib/api.js";
import { CATEGORIES } from "../../data/mockData.js";
import { money } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperInput, { PaperSelect, PaperRangeField } from "../../components/paper/PaperInput.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import ProductCard from "../../components/common/ProductCard.jsx";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

const PAGE_SIZE = 9;

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  // Blank means "no bound", so an empty box never filters anything out.
  const min = minPrice === "" ? null : Number(minPrice);
  const max = maxPrice === "" ? null : Number(maxPrice);
  // Someone will type 90 then 20; treat a reversed pair as the range
  // they meant rather than showing them nothing.
  const lo = min !== null && max !== null ? Math.min(min, max) : min;
  const hi = min !== null && max !== null ? Math.max(min, max) : max;
  const reversed = min !== null && max !== null && min > max;

  // Any filter change starts back at page 1 — a stale page number on a
  // narrowed result set would otherwise show an empty page or skip items.
  useEffect(() => {
    setPage(1);
  }, [query, category, lo, hi]);

  useEffect(() => {
    setLoading(true);
    setLoadError("");
    const handle = setTimeout(() => {
      productApi
        .listAll({
          search: query.trim() || undefined,
          category: category === "all" ? undefined : category,
          minPrice: lo ?? undefined,
          maxPrice: hi ?? undefined,
          page,
          limit: PAGE_SIZE,
        })
        .then((data) => setProducts(data))
        .catch((err) =>
          setLoadError(err instanceof ApiError ? err.message : "Could not load the catalog."),
        )
        .finally(() => setLoading(false));
    }, 300); // debounce so typing in search doesn't fire a request per keystroke
    return () => clearTimeout(handle);
  }, [query, category, lo, hi, page]);

  // The API doesn't return a total count, so "is there a next page" is
  // inferred from whether this page came back full.
  const hasNextPage = products.length === PAGE_SIZE;

  const visible = (() => {
    const sorted = [...products];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "name") sorted.sort((a, b) => a.productName.localeCompare(b.productName));
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted;
  })();

  return (
    <div>
      <PaperHeader
        eyebrow="the counter"
        title="Today's catalog"
        description="Goods from every stall on the floor, laid out in one place."
      />

      <PaperPanel className="mb-6">
        {/* One row on wide screens: search, category, sort, price range. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <PaperInput
              label="Search"
              type="search"
              placeholder="ink, notebook, apron…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <PaperSelect
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </PaperSelect>
          <PaperSelect label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </PaperSelect>

          <div className="sm:col-span-2">
            <PaperRangeField
              label="Price"
              fromLabel="Lowest price"
              toLabel="Highest price"
              prefix="$"
              error={
                reversed
                  ? `Read as ${money(lo)} to ${money(hi)} — the figures were the other way round.`
                  : undefined
              }
              fromProps={{
                inputMode: "decimal",
                min: "0",
                step: "0.01",
                placeholder: "any",
                value: minPrice,
                onChange: (e) => setMinPrice(e.target.value),
              }}
              toProps={{
                inputMode: "decimal",
                min: "0",
                step: "0.01",
                placeholder: "any",
                value: maxPrice,
                onChange: (e) => setMaxPrice(e.target.value),
              }}
            />
          </div>
        </div>

        <p className="mt-3 font-hand text-xl text-ink-faint">
          {visible.length} item{visible.length === 1 ? "" : "s"} on the table
          {(lo !== null || hi !== null) && (
            <>
              {" "}
              between {lo === null ? "any" : money(lo)} and {hi === null ? "any" : money(hi)}
            </>
          )}
        </p>
      </PaperPanel>

      {loadError && (
        <p role="alert" className="mb-4 font-hand text-lg text-ink-red">
          ↳ {loadError}
        </p>
      )}

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <PaperSpinner label="laying out the counter…" />
        </div>
      ) : visible.length === 0 ? (
        <PaperEmptyState
          title="No goods match that search"
          hint="Try a different word, or clear the filters to see the whole floor again."
          action={
            <PaperButton
              variant="stamp"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setSort("newest");
                setMinPrice("");
                setMaxPrice("");
              }}
            >
              Clear filters
            </PaperButton>
          }
        />
      ) : (
        <>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <li key={p._id} className="animate-paper-in">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-center gap-4">
            <PaperButton
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </PaperButton>
            <span className="font-hand text-xl text-ink-faint">Page {page}</span>
            <PaperButton size="sm" disabled={!hasNextPage} onClick={() => setPage((p) => p + 1)}>
              Next →
            </PaperButton>
          </div>
        </>
      )}
    </div>
  );
}
