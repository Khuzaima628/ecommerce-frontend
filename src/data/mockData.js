// In-memory seed data. No JSON files, no persistence — resets on refresh.

export const CATEGORIES = [
  "Stationery",
  "Books",
  "Art Supplies",
  "Home Goods",
  "Apparel",
];

export const ORDER_STATUSES = ["pending", "shipped", "delivered", "cancelled"];

export const mockUsers = [
  { id: "u-admin-1", name: "Miriam Vale", email: "miriam@deskmarket.test", role: "admin", banned: false },
  { id: "u-cust-1", name: "Nadia Farooq", email: "nadia@post.test", role: "customer", banned: false },
  { id: "u-cust-2", name: "Tomas Bergs", email: "tomas@post.test", role: "customer", banned: false },
  { id: "u-cust-3", name: "Ines Okafor", email: "ines@post.test", role: "customer", banned: false },
  {
    id: "u-sell-1",
    name: "Hollis Paper Co.",
    email: "hollis@makers.test",
    role: "seller",
    banned: false,
    shopName: "Hollis Paper Co.",
    bio: "Third-generation stationers. We fold, score and deckle everything by hand.",
    avatarInitial: "H",
  },
  {
    id: "u-sell-2",
    name: "Marchetti Bindery",
    email: "gio@makers.test",
    role: "seller",
    banned: false,
    shopName: "Marchetti Bindery",
    bio: "Small bindery working with reclaimed board and linen thread.",
    avatarInitial: "M",
  },
  {
    id: "u-sell-3",
    name: "Kestrel Ink Works",
    email: "kestrel@makers.test",
    role: "seller",
    banned: false,
    shopName: "Kestrel Ink Works",
    bio: "Iron-gall inks, pigments and pressed pigment cakes made in small batches.",
    avatarInitial: "K",
  },
];

const img = (seed) => `https://picsum.photos/seed/${seed}/600/600`;

/** Shared shipping/returns note, stamped on every product detail page. */
export const RETURN_POLICY =
  "Returns accepted within 30 days, unused and in its original wrapping. Postage home is on us for faulty goods.";

export const TAG_POOL = [
  "Handmade",
  "Bestseller",
  "Limited Stock",
  "Small Batch",
  "Restocked",
  "Archival",
  "Gift Wrapped",
];

const baseProducts = [
  { id: "p-01", name: "Deckled Letter Sheets (50)", description: "Cotton rag sheets with four deckled edges, torn on a vat frame. Takes fountain ink without feathering.", price: 18.0, stock: 24, category: "Stationery", image: img("letterpaper"), sellerId: "u-sell-1", active: true, createdAt: "2026-01-04T09:00:00Z" },
  { id: "p-02", name: "Kraft Envelope Bundle", description: "Twenty-five unbleached kraft envelopes, gummed flap, C6 size.", price: 9.5, stock: 61, category: "Stationery", image: img("envelopes"), sellerId: "u-sell-1", active: true, createdAt: "2026-01-09T09:00:00Z" },
  { id: "p-03", name: "Brass Paper Clips, Tin of 60", description: "Solid brass clips that develop a warm patina. Packed in a hinged tin.", price: 12.0, stock: 3, category: "Stationery", image: img("clips"), sellerId: "u-sell-1", active: true, createdAt: "2026-01-15T09:00:00Z" },
  { id: "p-04", name: "Gummed Paper Tape Roll", description: "Water-activated tape in a sepia tone. 50m roll, kraft backed.", price: 7.25, stock: 40, category: "Stationery", image: img("tape"), sellerId: "u-sell-1", active: true, createdAt: "2026-01-21T09:00:00Z" },
  { id: "p-05", name: "Blotter Pad, Desk Size", description: "Absorbent blotting pad in faded red, leather corners, A2.", price: 34.0, stock: 8, category: "Home Goods", image: img("blotter"), sellerId: "u-sell-1", active: false, createdAt: "2026-01-28T09:00:00Z" },
  { id: "p-06", name: "Rubber Date Stamp", description: "Self-inking date stamp with a beech handle. Ink pad included.", price: 21.0, stock: 17, category: "Stationery", image: img("stamp"), sellerId: "u-sell-1", active: true, createdAt: "2026-02-03T09:00:00Z" },

  { id: "p-07", name: "Linen Grid Notebook", description: "Sewn signatures, linen-wrapped board, 160 grid pages, lies flat.", price: 26.0, stock: 19, category: "Books", image: img("notebook"), sellerId: "u-sell-2", active: true, createdAt: "2026-01-06T09:00:00Z" },
  { id: "p-08", name: "Pocket Field Ledger", description: "Three-pack of stapled pocket ledgers with numbered columns.", price: 11.0, stock: 44, category: "Books", image: img("ledger"), sellerId: "u-sell-2", active: true, createdAt: "2026-01-12T09:00:00Z" },
  { id: "p-09", name: "Rebound Reader, Cloth Spine", description: "Public-domain reader rebound in oatmeal cloth with a hand-lettered spine.", price: 48.0, stock: 4, category: "Books", image: img("reader"), sellerId: "u-sell-2", active: true, createdAt: "2026-01-19T09:00:00Z" },
  { id: "p-10", name: "Bookbinder's Linen Thread", description: "Waxed 18/3 linen thread on a wooden spool. 50m.", price: 8.75, stock: 33, category: "Art Supplies", image: img("thread"), sellerId: "u-sell-2", active: true, createdAt: "2026-01-24T09:00:00Z" },
  { id: "p-11", name: "Bone Folder, Cattle Bone", description: "Polished folder for scoring and creasing. Softens with use.", price: 14.5, stock: 26, category: "Art Supplies", image: img("bonefolder"), sellerId: "u-sell-2", active: true, createdAt: "2026-02-01T09:00:00Z" },
  { id: "p-12", name: "Archive Box, Grey Board", description: "Acid-free clamshell box with a cotton ribbon pull. Foolscap.", price: 39.0, stock: 2, category: "Home Goods", image: img("archivebox"), sellerId: "u-sell-2", active: true, createdAt: "2026-02-08T09:00:00Z" },

  { id: "p-13", name: "Iron-Gall Ink, 30ml", description: "Traditional iron-gall formula that darkens to a deep grey-black on paper.", price: 16.0, stock: 22, category: "Art Supplies", image: img("inkbottle"), sellerId: "u-sell-3", active: true, createdAt: "2026-01-02T09:00:00Z" },
  { id: "p-14", name: "Sepia Walnut Ink", description: "Ground walnut hull ink with a warm brown wash. Glass bottle, 30ml.", price: 15.0, stock: 12, category: "Art Supplies", image: img("sepiaink"), sellerId: "u-sell-3", active: true, createdAt: "2026-01-11T09:00:00Z" },
  { id: "p-15", name: "Pressed Pigment Cakes, Set of 6", description: "Earth pigments bound with gum arabic and pressed into a tin palette.", price: 42.0, stock: 6, category: "Art Supplies", image: img("pigments"), sellerId: "u-sell-3", active: true, createdAt: "2026-01-17T09:00:00Z" },
  { id: "p-16", name: "Dip Pen with Steel Nibs", description: "Turned oak holder with five assorted steel nibs in a paper sleeve.", price: 23.5, stock: 1, category: "Art Supplies", image: img("dippen"), sellerId: "u-sell-3", active: true, createdAt: "2026-01-26T09:00:00Z" },
  { id: "p-17", name: "Ink-Stained Work Apron", description: "Heavy canvas apron, sepia dyed, with three tool pockets.", price: 58.0, stock: 9, category: "Apparel", image: img("apron"), sellerId: "u-sell-3", active: true, createdAt: "2026-02-05T09:00:00Z" },
  { id: "p-18", name: "Printer's Sleeve Cuffs", description: "Pair of pull-on cotton cuffs that keep sleeves clear of wet ink.", price: 19.0, stock: 0, category: "Apparel", image: img("cuffs"), sellerId: "u-sell-3", active: true, createdAt: "2026-02-11T09:00:00Z" },
  { id: "p-19", name: "Corkboard Pin Tin", description: "Fifty brass-headed map pins in a slide-lid tin.", price: 6.5, stock: 55, category: "Home Goods", image: img("pins"), sellerId: "u-sell-1", active: true, createdAt: "2026-02-14T09:00:00Z" },
  { id: "p-20", name: "Desk Lamp Shade, Paper", description: "Folded paper shade that throws a warm, diffused light.", price: 44.0, stock: 5, category: "Home Goods", image: img("lampshade"), sellerId: "u-sell-2", active: true, createdAt: "2026-02-16T09:00:00Z" },
];


/* ------------------------------------------------------------------
   Every product carries richer detail: specs, rating, tags, sku and a
   small photo set. Seeded deterministically so nothing drifts between
   renders, and fully editable by the seller through the product form.
   ------------------------------------------------------------------ */

const SPEC_PRESETS = {
  Stationery: [
    { label: "Material", value: "Cotton rag, 120gsm" },
    { label: "Finish", value: "Deckled, unsized" },
    { label: "Origin", value: "Made by hand" },
  ],
  Books: [
    { label: "Binding", value: "Sewn signatures" },
    { label: "Cover", value: "Linen over board" },
    { label: "Origin", value: "Bound in-house" },
  ],
  "Art Supplies": [
    { label: "Material", value: "Pigment and gum arabic" },
    { label: "Volume", value: "30ml" },
    { label: "Origin", value: "Small batch" },
  ],
  "Home Goods": [
    { label: "Material", value: "Grey board and cotton" },
    { label: "Weight", value: "250g" },
    { label: "Origin", value: "Workshop made" },
  ],
  Apparel: [
    { label: "Material", value: "Heavy cotton canvas" },
    { label: "Care", value: "Cold wash, line dry" },
    { label: "Origin", value: "Cut and sewn locally" },
  ],
};

const seedOf = (id) => {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) % 9973;
  return h;
};

const decorate = (p, i) => {
  const s = seedOf(p.id);
  const tags = [TAG_POOL[s % TAG_POOL.length], TAG_POOL[(s + 3) % TAG_POOL.length]];
  if (p.stock > 0 && p.stock < 5) tags.push("Limited Stock");
  return {
    ...p,
    specs: SPEC_PRESETS[p.category] ?? SPEC_PRESETS.Stationery,
    rating: Number((3.6 + ((s % 14) / 10)).toFixed(1)),
    reviewsCount: 4 + (s % 137),
    tags: Array.from(new Set(tags)),
    sku: `PD-${String(i + 1).padStart(3, "0")}-${p.category.slice(0, 2).toUpperCase()}`,
    images: [p.image, `${p.image}?v=2`, `${p.image}?v=3`],
    returnPolicy: RETURN_POLICY,
  };
};

export const mockProducts = baseProducts.map(decorate);

/** Wishlist is a join collection: one row per (customer, product) pair. */
export const mockWishlist = [
  { id: "w-1", customerId: "u-cust-1", productId: "p-13" },
  { id: "w-2", customerId: "u-cust-1", productId: "p-20" },
  { id: "w-3", customerId: "u-cust-2", productId: "p-09" },
];

export const mockCart = [
  { customerId: "u-cust-1", items: [{ productId: "p-07", quantity: 1 }] },
  { customerId: "u-cust-2", items: [] },
  { customerId: "u-cust-3", items: [] },
];

export const mockOrders = [
  {
    id: "ORD-1041",
    customerId: "u-cust-1",
    items: [
      { productId: "p-01", name: "Deckled Letter Sheets (50)", price: 18.0, quantity: 2 },
      { productId: "p-13", name: "Iron-Gall Ink, 30ml", price: 16.0, quantity: 1 },
    ],
    totalAmount: 52.0,
    status: "delivered",
    paymentStatus: "paid",
    createdAt: "2026-06-02T10:24:00Z",
  },
  {
    id: "ORD-1042",
    customerId: "u-cust-2",
    items: [{ productId: "p-07", name: "Linen Grid Notebook", price: 26.0, quantity: 3 }],
    totalAmount: 78.0,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2026-07-18T14:02:00Z",
  },
  {
    id: "ORD-1043",
    customerId: "u-cust-3",
    items: [
      { productId: "p-15", name: "Pressed Pigment Cakes, Set of 6", price: 42.0, quantity: 1 },
      { productId: "p-11", name: "Bone Folder, Cattle Bone", price: 14.5, quantity: 2 },
    ],
    totalAmount: 71.0,
    status: "pending",
    paymentStatus: "paid",
    createdAt: "2026-08-09T08:41:00Z",
  },
  {
    id: "ORD-1044",
    customerId: "u-cust-1",
    items: [{ productId: "p-03", name: "Brass Paper Clips, Tin of 60", price: 12.0, quantity: 4 }],
    totalAmount: 48.0,
    status: "cancelled",
    paymentStatus: "pending",
    createdAt: "2026-08-11T16:15:00Z",
  },
  {
    id: "ORD-1045",
    customerId: "u-cust-2",
    items: [
      { productId: "p-17", name: "Ink-Stained Work Apron", price: 58.0, quantity: 1 },
      { productId: "p-04", name: "Gummed Paper Tape Roll", price: 7.25, quantity: 2 },
    ],
    totalAmount: 72.5,
    status: "pending",
    paymentStatus: "paid",
    createdAt: "2026-08-13T11:05:00Z",
  },
];

export const mockActivity = [
  { id: "a-1", actorId: "u-sell-2", message: "Order ORD-1042 marked shipped", createdAt: "2026-07-19T09:12:00Z" },
  { id: "a-2", actorId: "u-sell-1", message: "Stock updated for Brass Paper Clips, Tin of 60", createdAt: "2026-08-02T13:30:00Z" },
  { id: "a-3", actorId: "u-sell-3", message: "You added Printer's Sleeve Cuffs", createdAt: "2026-08-06T15:44:00Z" },
  { id: "a-4", actorId: "u-sell-1", message: "Blotter Pad, Desk Size hidden from the catalog", createdAt: "2026-08-10T10:02:00Z" },
];
