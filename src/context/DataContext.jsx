import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  RETURN_POLICY,
  mockActivity,
  mockCart,
  mockOrders,
  mockProducts,
  mockUsers,
  mockWishlist,
} from "../data/mockData.js";
import { useToast } from "./ToastContext.jsx";
   
const DataContext = createContext(null);

let idCounter = 100;
const nextId = (prefix) => {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
};

/** Order journey: payment and fulfilment as one continuous line. */
export const ORDER_STAGES = ["pending", "paid", "shipped", "delivered"];

export function stageOf(order) {
  if (!order) return 0;
  if (order.status === "delivered") return 3;
  if (order.status === "shipped") return 2;
  if (order.paymentStatus === "paid") return 1;
  return 0;
}

const cleanSpecs = (specs) =>
  (specs ?? [])
    .map((s) => ({ label: String(s.label ?? "").trim(), value: String(s.value ?? "").trim() }))
    .filter((s) => s.label && s.value);

export function DataProvider({ children }) {
  const [users, setUsers] = useState(mockUsers);
  const [products, setProducts] = useState(mockProducts);
  const [orders, setOrders] = useState(mockOrders);
  const [carts, setCarts] = useState(mockCart);
  const [activity, setActivity] = useState(mockActivity);
  const [wishlist, setWishlist] = useState(mockWishlist);
  const { toast } = useToast();

  /* ---------------- activity ---------------- */
  const logActivity = useCallback((actorId, message) => {
    setActivity((prev) => [
      { id: nextId("a"), actorId, message, createdAt: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  /* ---------------- lookups ---------------- */
  const getUser = useCallback((id) => users.find((u) => u.id === id) || null, [users]);
  const getProduct = useCallback((id) => products.find((p) => p.id === id) || null, [products]);

  const bannedSellerIds = useMemo(
    () => new Set(users.filter((u) => u.banned).map((u) => u.id)),
    [users],
  );

  /** Products a customer may actually see and buy. */
  const catalogProducts = useMemo(
    () => products.filter((p) => p.active && !bannedSellerIds.has(p.sellerId)),
    [products, bannedSellerIds],
  );

  /* ---------------- products ---------------- */
  const addProduct = useCallback(
    (sellerId, draft) => {
      const image = draft.image.trim();
      const product = {
        id: nextId("p"),
        name: draft.name.trim(),
        description: draft.description.trim(),
        price: Number(draft.price),
        stock: Number(draft.stock),
        category: draft.category,
        image,
        images: [image, `${image}?v=2`, `${image}?v=3`],
        sellerId,
        active: true,
        createdAt: new Date().toISOString(),
        specs: cleanSpecs(draft.specs),
        tags: draft.tags ?? [],
        sku: (draft.sku ?? "").trim() || `PD-${nextId("x").slice(2)}`,
        returnPolicy: (draft.returnPolicy ?? "").trim() || RETURN_POLICY,
        rating: 0,
        reviewsCount: 0,
      };
      setProducts((prev) => [product, ...prev]);
      logActivity(sellerId, `You added ${product.name}`);
      toast(`${product.name} added to your stall`);
      return product;
    },
    [logActivity, toast],
  );

  const updateProduct = useCallback(
    (productId, patch) => {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id !== productId) return p;
          const image = patch.image !== undefined ? patch.image : p.image;
          return {
            ...p,
            ...patch,
            image,
            images: patch.image !== undefined ? [image, `${image}?v=2`, `${image}?v=3`] : p.images,
            specs: patch.specs !== undefined ? cleanSpecs(patch.specs) : p.specs,
            price: patch.price !== undefined ? Number(patch.price) : p.price,
            stock: patch.stock !== undefined ? Math.max(0, Number(patch.stock)) : p.stock,
          };
        }),
      );
      const p = products.find((x) => x.id === productId);
      if (p) logActivity(p.sellerId, `You edited ${patch.name ?? p.name}`);
      toast(`${patch.name ?? p?.name ?? "Product"} updated`);
    },
    [products, logActivity, toast],
  );

  const deleteProduct = useCallback(
    (productId) => {
      const p = products.find((x) => x.id === productId);
      setProducts((prev) => prev.filter((x) => x.id !== productId));
      // Past orders keep their snapshots; only live carts and wishlists are cleaned up.
      setCarts((prev) =>
        prev.map((c) => ({ ...c, items: c.items.filter((i) => i.productId !== productId) })),
      );
      setWishlist((prev) => prev.filter((w) => w.productId !== productId));
      if (p) {
        logActivity(p.sellerId, `${p.name} was deleted`);
        toast(`${p.name} was removed`, { tone: "warning" });
      }
    },
    [products, logActivity, toast],
  );

  const adjustStock = useCallback(
    (productId, delta) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p)),
      );
      const p = products.find((x) => x.id === productId);
      if (p) {
        logActivity(p.sellerId, `Stock updated for ${p.name}`);
        toast(`Stock ${delta > 0 ? "raised" : "lowered"} for ${p.name}`);
      }
    },
    [products, logActivity, toast],
  );

  const toggleProductActive = useCallback(
    (productId) => {
      const p = products.find((x) => x.id === productId);
      setProducts((prev) =>
        prev.map((x) => (x.id === productId ? { ...x, active: !x.active } : x)),
      );
      if (p) {
        logActivity(
          p.sellerId,
          p.active ? `${p.name} hidden from the catalog` : `${p.name} is back on the shelf`,
        );
        toast(p.active ? `${p.name} hidden from the catalog` : `${p.name} is back on the shelf`);
      }
    },
    [products, logActivity, toast],
  );

  /* ---------------- wishlist ---------------- */
  const isWishlisted = useCallback(
    (customerId, productId) =>
      wishlist.some((w) => w.customerId === customerId && w.productId === productId),
    [wishlist],
  );

  const toggleWishlist = useCallback(
    (customerId, productId) => {
      const product = products.find((p) => p.id === productId);
      const exists = wishlist.some(
        (w) => w.customerId === customerId && w.productId === productId,
      );
      setWishlist((prev) =>
        exists
          ? prev.filter((w) => !(w.customerId === customerId && w.productId === productId))
          : [...prev, { id: nextId("w"), customerId, productId }],
      );
      toast(
        exists
          ? `Removed from wishlist${product ? ` — ${product.name}` : ""}`
          : `Added to wishlist${product ? ` — ${product.name}` : ""}`,
      );
    },
    [wishlist, products, toast],
  );

  const getWishlistProducts = useCallback(
    (customerId) =>
      wishlist
        .filter((w) => w.customerId === customerId)
        .map((w) => products.find((p) => p.id === w.productId))
        .filter(Boolean)
        .map((p) => ({
          ...p,
          unavailable: !p.active || bannedSellerIds.has(p.sellerId),
        })),
    [wishlist, products, bannedSellerIds],
  );

  /* ---------------- cart ---------------- */
  const getCartItems = useCallback(
    (customerId) => carts.find((c) => c.customerId === customerId)?.items ?? [],
    [carts],
  );

  const setCartItems = useCallback((customerId, updater) => {
    setCarts((prev) => {
      const existing = prev.find((c) => c.customerId === customerId);
      if (!existing) return [...prev, { customerId, items: updater([]) }];
      return prev.map((c) =>
        c.customerId === customerId ? { ...c, items: updater(c.items) } : c,
      );
    });
  }, []);

  const addToCart = useCallback(
    (customerId, productId, quantity = 1) => {
      setCartItems(customerId, (items) => {
        const found = items.find((i) => i.productId === productId);
        if (found) {
          return items.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
          );
        }
        return [...items, { productId, quantity }];
      });
      const p = products.find((x) => x.id === productId);
      toast(`Added to cart${p ? ` — ${p.name}` : ""}`, {
        note: quantity > 1 ? `${quantity} of them` : null,
      });
    },
    [setCartItems, products, toast],
  );

  const setCartQuantity = useCallback(
    (customerId, productId, quantity) => {
      setCartItems(customerId, (items) =>
        quantity <= 0
          ? items.filter((i) => i.productId !== productId)
          : items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      );
      const p = products.find((x) => x.id === productId);
      if (quantity <= 0) toast(`Removed from cart${p ? ` — ${p.name}` : ""}`, { tone: "warning" });
      else toast(`Quantity set to ${quantity}${p ? ` — ${p.name}` : ""}`);
    },
    [setCartItems, products, toast],
  );

  const removeFromCart = useCallback(
    (customerId, productId) => {
      setCartItems(customerId, (items) => items.filter((i) => i.productId !== productId));
      const p = products.find((x) => x.id === productId);
      toast(`Removed from cart${p ? ` — ${p.name}` : ""}`, { tone: "warning" });
    },
    [setCartItems, products, toast],
  );

  const clearCart = useCallback(
    (customerId) => setCartItems(customerId, () => []),
    [setCartItems],
  );

  /* ---------------- orders ---------------- */
  const placeOrder = useCallback(
    (customerId) => {
      const items = getCartItems(customerId);
      const lines = [];
      items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product || !product.active || product.stock <= 0) return;
        const quantity = Math.min(item.quantity, product.stock); // never oversell
        lines.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
        });
      });
      if (lines.length === 0) {
        toast("Nothing could be ordered", {
          tone: "warning",
          note: "your cart is empty or out of stock",
        });
        return null;
      }

      const order = {
        id: `ORD-${1045 + orders.length + 1}`,
        customerId,
        items: lines,
        totalAmount: Number(
          lines.reduce((sum, l) => sum + l.price * l.quantity, 0).toFixed(2),
        ),
        status: "pending",
        paymentStatus: "paid",
        createdAt: new Date().toISOString(),
      };

      setOrders((prev) => [order, ...prev]);
      setProducts((prev) =>
        prev.map((p) => {
          const line = lines.find((l) => l.productId === p.id);
          return line ? { ...p, stock: Math.max(0, p.stock - line.quantity) } : p;
        }),
      );
      clearCart(customerId);

      const sellerIds = new Set(
        lines.map((l) => products.find((p) => p.id === l.productId)?.sellerId).filter(Boolean),
      );
      sellerIds.forEach((sid) => logActivity(sid, `New order ${order.id} received`));
      toast(`Order ${order.id} placed`, { note: "filed on the spike" });
      return order;
    },
    [getCartItems, products, orders.length, clearCart, logActivity, toast],
  );

  const updateOrderStatus = useCallback(
    (orderId, status, actorId) => {
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      if (actorId) logActivity(actorId, `Order ${orderId} marked ${status}`);
      toast(`Order ${orderId} marked ${status}`);
    },
    [logActivity, toast],
  );

  const cancelOrder = useCallback(
    (orderId, actorId) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order || (order.status !== "pending")) return;
      // Return the stock to the shelf for products that still exist.
      setProducts((prev) =>
        prev.map((p) => {
          const line = order.items.find((l) => l.productId === p.id);
          return line ? { ...p, stock: p.stock + line.quantity } : p;
        }),
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled", paymentStatus: "pending" } : o,
        ),
      );
      const sellerIds = new Set(
        order.items.map((l) => products.find((p) => p.id === l.productId)?.sellerId).filter(Boolean),
      );
      sellerIds.forEach((sid) => logActivity(sid, `Order ${orderId} was cancelled`));
      if (actorId && !sellerIds.has(actorId)) logActivity(actorId, `Order ${orderId} cancelled`);
      toast(`Order ${orderId} cancelled`, { tone: "warning", note: "stock returned to the shelf" });
    },
    [orders, products, logActivity, toast],
  );

  /**
   * Move an order one stop along the journey. Skipping stages and moving
   * backwards is refused here as well as in the UI, so the single source of
   * truth can never hold an impossible state.
   */
  const advanceOrderStage = useCallback(
    (orderId, targetStage, actorId) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order || order.status === "cancelled" || order.status === "delivered") return false;
      if (targetStage !== stageOf(order) + 1) return false;

      const patch =
        targetStage === 1
          ? { paymentStatus: "paid" }
          : targetStage === 2
            ? { status: "shipped" }
            : { status: "delivered" };
      const label = ORDER_STAGES[targetStage];

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, ...patch } : o)));
      if (actorId) logActivity(actorId, `Order ${orderId} marked ${label}`);
      toast(`Order ${orderId} marked ${label}`);
      return true;
    },
    [orders, logActivity, toast],
  );

  /* ---------------- users ---------------- */
  const setUserBanned = useCallback(
    (userId, banned) => {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, banned } : u)));
      const u = users.find((x) => x.id === userId);
      toast(`${u?.name ?? "User"} ${banned ? "banned" : "reinstated"}`, {
        tone: banned ? "warning" : "kraft",
      });
    },
    [users, toast],
  );

  const removeUser = useCallback(
    (userId) => {
      const u = users.find((x) => x.id === userId);
      setUsers((prev) => prev.filter((x) => x.id !== userId));
      setProducts((prev) => prev.filter((p) => p.sellerId !== userId));
      setWishlist((prev) => prev.filter((w) => w.customerId !== userId));
      toast(`${u?.name ?? "User"} removed from the ledger`, { tone: "warning" });
    },
    [users, toast],
  );

  const updateSellerProfile = useCallback(
    (userId, patch) => {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, ...patch, name: patch.shopName ?? u.name } : u,
        ),
      );
      logActivity(userId, "You updated the shop profile");
      toast("Shop profile saved");
    },
    [logActivity, toast],
  );

  /** Shared profile save used by the top-level /profile page, any role. */
  const updateProfile = useCallback(
    (userId, patch) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          const next = { ...u, ...patch };
          if (u.role === "seller" && patch.shopName) next.name = patch.shopName;
          else if (patch.name) next.name = patch.name;
          return next;
        }),
      );
      const u = users.find((x) => x.id === userId);
      if (u?.role === "seller") logActivity(userId, "You updated the shop profile");
      toast("Profile saved");
    },
    [users, logActivity, toast],
  );

  const value = useMemo(
    () => ({
      users,
      products,
      orders,
      carts,
      activity,
      wishlist,
      catalogProducts,
      bannedSellerIds,
      getUser,
      getProduct,
      getCartItems,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustStock,
      toggleProductActive,
      isWishlisted,
      toggleWishlist,
      getWishlistProducts,
      addToCart,
      setCartQuantity,
      removeFromCart,
      clearCart,
      placeOrder,
      updateOrderStatus,
      advanceOrderStage,
      cancelOrder,
      setUserBanned,
      removeUser,
      updateSellerProfile,
      updateProfile,
      logActivity,
    }),
    [
      users, products, orders, carts, activity, wishlist, catalogProducts, bannedSellerIds,
      getUser, getProduct, getCartItems, addProduct, updateProduct, deleteProduct,
      adjustStock, toggleProductActive, isWishlisted, toggleWishlist, getWishlistProducts,
      addToCart, setCartQuantity, removeFromCart,
      clearCart, placeOrder, updateOrderStatus, advanceOrderStage, cancelOrder, setUserBanned,
      removeUser, updateSellerProfile, updateProfile, logActivity,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}
