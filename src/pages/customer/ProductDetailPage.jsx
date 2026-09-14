import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "@tanstack/react-router";
import { productApi } from "../../lib/productApi.js";
import { cartApi } from "../../lib/cartApi.js";
import { ApiError } from "../../lib/api.js";
import { useToast } from "../../context/ToastContext.jsx";
import { money } from "../../lib/paper.js";
import PaperPanel from "../../components/paper/PaperPanel.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperBadge from "../../components/paper/PaperBadge.jsx";
import PaperTag from "../../components/paper/PaperTag.jsx";
import PaperEmptyState from "../../components/paper/PaperEmptyState.jsx";
import PaperStamp from "../../components/paper/PaperStamp.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import WishlistHeart from "../../components/common/WishlistHeart.jsx";

export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/customer/products/$productId" });
  const { toast } = useToast();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [adding, setAdding] = useState(false);
  const [shot, setShot] = useState(0);
  const requestedId = useRef(null);

  useEffect(() => {
    // Guards against React 18 Strict Mode's dev-time double-invoke firing
    // this GET twice for the same product. Keyed by productId (rather than
    // a plain boolean) so navigating to a different product still fetches.
    if (requestedId.current === productId) return;
    requestedId.current = productId;

    setLoading(true);
    productApi
      .getOne(productId)
      .then((data) => setProduct(data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <PaperSpinner label="fetching the item…" />
      </div>
    );
  }

  if (!product) {
    return (
      <PaperEmptyState
        title="That item is no longer on the shelf"
        hint="The seller may have removed or hidden it."
        action={
          <PaperButton as={Link} to="/customer/products" variant="stamp">
            Back to the catalog
          </PaperButton>
        }
      />
    );
  }

  const gallery = product.images?.length ? product.images : [];
  const remaining = product.stock;
  const out = remaining === 0;

  const add = async () => {
    setAdding(true);
    try {
      await cartApi.add(product._id, Math.min(quantity, remaining));
      setAdded(true);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not add that to your cart.", { tone: "warning" });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <Link
        to="/customer/products"
        className="mb-4 inline-block font-hand text-xl text-paper-2 hover:text-paper-1"
      >
        ← back to the catalog
      </Link>

      <PaperPanel torn className="crumple-deep">
        <div className="grid gap-8 md:grid-cols-2">
          {/* ---------- paper-mounted photographs ---------- */}
          <div>
            <div className="relative rotate-[-1deg] border border-paper-edge bg-paper-2 p-3 shadow-lift">
              <img
                src={gallery[shot]}
                alt={product.productName}
                className="w-full object-cover mix-blend-multiply saturate-[0.72]"
              />
              {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(
                (pos) => (
                  <span
                    key={pos}
                    aria-hidden="true"
                    className={`absolute ${pos} h-5 w-5 border border-paper-edge/70 bg-paper-3/85`}
                  />
                ),
              )}
              <span
                aria-hidden="true"
                className="absolute -left-3 top-6 h-6 w-20 -rotate-[18deg] border border-paper-edge/50 bg-paper-2/80 shadow-sheet"
              />
            </div>

            <ul className="mt-5 flex flex-wrap gap-3">
              {gallery.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    onClick={() => setShot(i)}
                    aria-label={`Show photograph ${i + 1} of ${product.productName}`}
                    aria-current={i === shot}
                    className={
                      "block border bg-paper-2 p-1.5 shadow-sheet transition-transform hover:-translate-y-0.5 " +
                      (i === shot
                        ? "-rotate-[3deg] border-kraft"
                        : "rotate-[2deg] border-paper-edge opacity-80")
                    }
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="h-16 w-16 object-cover mix-blend-multiply saturate-[0.7]"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- details ---------- */}
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h1 className="font-display text-3xl leading-tight text-ink-1">{product.productName}</h1>
              <PaperTag className="text-lg">{money(product.price)}</PaperTag>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {(product.tags ?? []).map((t) => (
                <PaperTag key={t} className="text-[11px]">
                  {t}
                </PaperTag>
              ))}
              <WishlistHeart productId={product._id} />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <PaperBadge tone="kraft">{product.category}</PaperBadge>
              {out ? (
                <PaperBadge tone="red">Out of stock</PaperBadge>
              ) : (
                <PaperBadge tone={remaining < 5 ? "orange" : "green"}>
                  {remaining} available
                </PaperBadge>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-3">{product.description}</p>

            {/* receipt stub */}
            <p className="mt-2 border-t border-dashed border-paper-edge pt-2 font-body text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              Product code · {product.sku ?? "—"}
            </p>

            {/* torn-edge fact card */}
            {(product.specifications ?? []).length > 0 && (
              <div className="torn-edges relative mt-5 rotate-[-0.5deg] bg-paper-2 px-5 py-5 shadow-sheet">
                <span aria-hidden="true" className="paper-grain opacity-45" />
                <div className="relative">
                  <h2 className="font-hand text-2xl leading-none text-ink-1">
                    Materials & specifications
                  </h2>
                  <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                    {product.specifications.map((sp) => (
                      <div key={sp.label} className="border-b border-dashed border-paper-edge pb-1">
                        <dt className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                          {sp.label}
                        </dt>
                        <dd className="font-display text-sm text-ink-2">{sp.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            )}

            {product.returns_note && (
              <div className="mt-5 flex flex-wrap items-start gap-3">
                <PaperStamp tone="kraft">shipping &amp; returns</PaperStamp>
                <p className="max-w-sm flex-1 text-xs leading-relaxed text-ink-faint">
                  {product.returns_note}
                </p>
              </div>
            )}

            <div className="torn-bottom relative mt-6 flex flex-wrap items-end gap-5 border border-paper-edge bg-paper-2 px-4 py-4 shadow-sheet sm:px-5">
              <span aria-hidden="true" className="paper-grain opacity-45" />
              <div>
                <label
                  htmlFor="qty"
                  className="relative mb-2 block font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-kraft"
                >
                  Quantity
                </label>
                <div className="relative flex items-center gap-1 rounded-[2px] border border-paper-edge bg-paper-1 p-1 shadow-[inset_0_1px_3px_rgba(90,75,50,0.12)]">
                  <PaperButton
                    size="sm"
                    variant="tag"
                    className="h-8 w-8 px-0 font-display text-lg leading-none"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    −
                  </PaperButton>
                  <input
                    id="qty"
                    type="number"
                    min="1"
                    max={Math.max(1, remaining)}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(1, Math.min(remaining || 1, Number(e.target.value) || 1)),
                      )
                    }
                    className="h-8 w-14 rounded-[2px] border border-kraft/50 bg-paper-2 px-2 py-1 text-center font-display text-base text-ink-1 shadow-[inset_0_2px_4px_rgba(90,75,50,0.13)]"
                  />
                  <PaperButton
                    size="sm"
                    variant="tag"
                    className="h-8 w-8 px-0 font-display text-lg leading-none"
                    aria-label="Increase quantity"
                    disabled={quantity >= remaining}
                    onClick={() => setQuantity((q) => Math.min(remaining, q + 1))}
                  >
                    +
                  </PaperButton>
                </div>
              </div>

              <div className="relative flex-1 sm:min-w-48">
                <p className="mb-2 font-hand text-lg leading-none text-ink-faint">
                  {out ? "This drawer is empty." : "A good choice for the desk."}
                </p>
                <PaperButton variant="stamp" size="lg" className="w-full" disabled={out || adding} onClick={add}>
                {out ? "Out of stock" : adding ? "Adding…" : "Add to cart"}
                </PaperButton>
              </div>

              {added && (
                <div className="flex items-center gap-3">
                  <PaperStamp tone="green" animate>
                    added
                  </PaperStamp>
                  <PaperButton
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate({ to: "/customer/cart" })}
                  >
                    Go to cart →
                  </PaperButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </PaperPanel>
    </div>
  );
}
