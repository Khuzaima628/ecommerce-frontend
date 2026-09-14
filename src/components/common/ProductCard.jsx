import { Link } from "@tanstack/react-router";
import PaperCard from "../paper/PaperCard.jsx";
import PaperBadge from "../paper/PaperBadge.jsx";
import PaperTag from "../paper/PaperTag.jsx";
import { money } from "../../lib/paper.js";
import WishlistHeart from "./WishlistHeart.jsx";

export default function ProductCard({ product, sellerName }) {
  const out = product.stock === 0;
  return (
    <PaperCard tiltId={product._id} interactive foldCorner className="h-full bg-paper-1 p-3">
      <div className="relative mb-3 overflow-hidden border border-paper-edge bg-paper-3">
        <img
          src={product.images?.[0]}
          alt={product.productName}
          loading="lazy"
          className="aspect-square w-full object-cover mix-blend-multiply saturate-[0.72] contrast-[0.95]"
        />
        <span
          aria-hidden="true"
          className="absolute -left-4 top-3 h-5 w-16 rotate-[-24deg] border border-paper-edge/50 bg-paper-2/75"
        />
        <span className="absolute right-2 top-2">
          <WishlistHeart productId={product._id} size="sm" />
        </span>
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-base leading-snug text-ink-1">
          <Link
            to="/customer/products/$productId"
            params={{ productId: product._id }}
            className="hover:ink-underline"
          >
            {product.productName}
          </Link>
        </h3>
        <PaperTag>{money(product.price)}</PaperTag>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-ink-faint">{product.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PaperBadge tone="kraft">{product.category}</PaperBadge>
        {out ? (
          <PaperBadge tone="red">Out of stock</PaperBadge>
        ) : (
          <PaperBadge tone={product.stock < 5 ? "orange" : "green"}>
            {product.stock} in stock
          </PaperBadge>
        )}
      </div>
      {sellerName && (
        <p className="mt-2 font-hand text-lg leading-none text-ink-3">from {sellerName}</p>
      )}
    </PaperCard>
  );
}
