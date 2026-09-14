import { useEffect, useState } from "react";
import { productApi } from "../../lib/productApi.js";
import { ApiError } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { LOW_STOCK, money } from "../../lib/paper.js";
import PaperHeader from "../../components/paper/PaperHeader.jsx";
import PaperCard from "../../components/paper/PaperCard.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperStamp from "../../components/paper/PaperStamp.jsx";
import PaperModal from "../../components/paper/PaperModal.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import ProductFormModal from "./ProductFormModal.jsx";

export default function SellerProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [visibility, setVisibility] = useState("all");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    setLoadError("");
    productApi
      .listMine()
      .then((data) => setProducts(data))
      .catch((err) => setLoadError(err instanceof ApiError ? err.message : "Could not load products."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const shown = products.filter((p) =>
    visibility === "shown" ? !p.isHidden : visibility === "hidden" ? p.isHidden : true,
  );
  const shownCount = products.filter((p) => !p.isHidden).length;
  const hiddenCount = products.length - shownCount;

  const adjustStock = async (pid, delta) => {
    setBusyId(pid);
    try {
      const updated = await productApi.changeStock(pid, delta);
      setProducts((prev) => prev.map((p) => (p._id === pid ? { ...p, ...updated } : p)));
      toast(`Stock ${delta > 0 ? "raised" : "lowered"}`);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not update stock.", { tone: "warning" });
    } finally {
      setBusyId(null);
    }
  };

  const toggleHide = async (p) => {
    setBusyId(p._id);
    try {
      await productApi.toggleHide(p._id);
      setProducts((prev) =>
        prev.map((x) => (x._id === p._id ? { ...x, isHidden: !x.isHidden } : x)),
      );
      toast(p.isHidden ? `${p.productName} is back on the shelf` : `${p.productName} hidden from the catalog`);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not update product.", { tone: "warning" });
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await productApi.remove(pendingDelete._id);
      setProducts((prev) => prev.filter((p) => p._id !== pendingDelete._id));
      toast(`${pendingDelete.productName} was removed`, { tone: "warning" });
      setPendingDelete(null);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not delete product.", { tone: "warning" });
    } finally {
      setDeleting(false);
    }
  };

  const submitForm = async (draft) => {
    if (editing) {
      const updated = await productApi.update(editing._id, draft);
      setProducts((prev) => prev.map((p) => (p._id === editing._id ? { ...p, ...updated } : p)));
      toast(`${updated.productName ?? draft.productName} updated`);
    } else {
      const created = await productApi.create(draft);
      setProducts((prev) => [created, ...prev]);
      toast(`${created.productName} added to your stall`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PaperSpinner label="fetching the stock room…" />
      </div>
    );
  }

  return (
    <div>
      <PaperHeader
        eyebrow="the stock room"
        title="Your products"
        description="Everything you sell, hidden items included."
        actions={
          <PaperButton
            variant="stamp"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            + Add product
          </PaperButton>
        }
      />

      {loadError && (
        <p role="alert" className="mb-4 font-hand text-lg text-ink-red">
          ↳ {loadError}
        </p>
      )}

      {products.length === 0 ? (
        <PaperEmptyState
          title="The stock room is bare"
          hint="Add your first product and it appears in the customer catalog straight away."
          action={
            <PaperButton
              variant="stamp"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              Add your first product
            </PaperButton>
          }
        />
      ) : (
        <>
          <PaperPanel className="mb-6">
            <fieldset>
              <legend className="mb-2 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-kraft">
                Show
              </legend>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All", n: products.length },
                  { value: "shown", label: "On the floor", n: shownCount },
                  { value: "hidden", label: "Hidden", n: hiddenCount },
                ].map((opt) => (
                  <PaperButton
                    key={opt.value}
                    size="sm"
                    variant={visibility === opt.value ? "stamp" : "tag"}
                    aria-pressed={visibility === opt.value}
                    onClick={() => setVisibility(opt.value)}
                  >
                    {opt.label} ({opt.n})
                  </PaperButton>
                ))}
              </div>
            </fieldset>
          </PaperPanel>

          {shown.length === 0 ? (
            <PaperEmptyState
              title={
                visibility === "hidden"
                  ? "Nothing is hidden right now"
                  : "Nothing is on the floor right now"
              }
              hint="Change the filter above to see the rest of your stock."
              action={
                <PaperButton variant="stamp" onClick={() => setVisibility("all")}>
                  Show everything
                </PaperButton>
              }
            />
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((p) => (
                <li key={p._id} className="animate-paper-in">
                  <PaperCard
                    tiltId={p._id}
                    layered
                    className={!p.isHidden ? "h-full bg-paper-1" : "h-full bg-paper-3 opacity-80"}
                  >
                    <div className="relative mb-3">
                      <img
                        src={p.images?.[0]}
                        alt={p.productName}
                        loading="lazy"
                        className={`aspect-[4/3] w-full border border-paper-edge object-cover mix-blend-multiply ${
                          !p.isHidden ? "saturate-[0.72]" : "grayscale"
                        }`}
                      />
                      {p.isHidden && (
                        <span className="absolute left-3 top-3">
                          <PaperStamp tone="red" className="text-sm">
                            hidden
                          </PaperStamp>
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-base text-ink-1">{p.productName}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <PaperBadge tone="kraft">{p.category}</PaperBadge>
                      <PaperBadge
                        tone={p.stock === 0 ? "red" : p.stock < LOW_STOCK ? "orange" : "green"}
                      >
                        {p.stock} in stock
                      </PaperBadge>
                      <span className="font-display text-lg text-ink-1">{money(p.price)}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-1 border-t border-dashed border-paper-edge pt-3">
                      <span className="mr-auto font-body text-[11px] font-bold uppercase tracking-[0.14em] text-kraft">
                        Stock
                      </span>
                      <PaperButton
                        size="sm"
                        aria-label={`Decrease stock of ${p.productName}`}
                        disabled={p.stock === 0 || busyId === p._id}
                        onClick={() => adjustStock(p._id, -1)}
                      >
                        −
                      </PaperButton>
                      <PaperButton
                        size="sm"
                        aria-label={`Increase stock of ${p.productName}`}
                        disabled={busyId === p._id}
                        onClick={() => adjustStock(p._id, 1)}
                      >
                        +
                      </PaperButton>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <PaperButton
                        size="sm"
                        onClick={() => {
                          setEditing(p);
                          setFormOpen(true);
                        }}
                      >
                        Edit
                      </PaperButton>
                      <PaperButton
                        size="sm"
                        variant="kraft"
                        disabled={busyId === p._id}
                        onClick={() => toggleHide(p)}
                      >
                        {p.isHidden ? "Show" : "Hide"}
                      </PaperButton>
                      <PaperButton size="sm" variant="danger" onClick={() => setPendingDelete(p)}>
                        Delete
                      </PaperButton>
                    </div>
                  </PaperCard>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <ProductFormModal
        open={formOpen}
        product={editing}
        onClose={() => setFormOpen(false)}
        onSubmit={submitForm}
      />

      <PaperModal
        open={Boolean(pendingDelete)}
        onClose={() => !deleting && setPendingDelete(null)}
        tone="warning"
        size="sm"
        title="Tear this up?"
        description={pendingDelete ? `${pendingDelete.productName} will leave the catalog.` : ""}
        footer={
          <>
            <PaperButton disabled={deleting} onClick={() => setPendingDelete(null)}>
              Keep it
            </PaperButton>
            <PaperButton variant="danger" disabled={deleting} onClick={confirmDelete}>
              {deleting ? "Tearing…" : "Delete product"}
            </PaperButton>
          </>
        }
      >
        <p className="font-hand text-xl leading-snug text-ink-red">
          This removes the product from your stall entirely.
        </p>
        {deleting && (
          <div className="mt-3">
            <PaperSpinner label="tearing the page…" />
          </div>
        )}
      </PaperModal>
    </div>
  );
}
