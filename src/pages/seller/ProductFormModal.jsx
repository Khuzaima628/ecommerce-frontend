import { useEffect, useState } from "react";
import PaperModal from "../../components/paper/PaperModal.jsx";
import PaperButton from "../../components/paper/PaperButton.jsx";
import PaperInput, {
  PaperSelect,
  PaperTextarea,
} from "../../components/paper/PaperInput.jsx";
import PaperSpinner from "../../components/paper/PaperSpinner.jsx";
import ImageUploadField from "../../components/common/ImageUploadField.jsx";
import { ApiError } from "../../lib/api.js";
import { uploadFile } from "../../lib/mediaApi.js";

// Fixed enums straight from auth_company_product.md — the backend rejects anything else.
export const CATEGORIES = ["stationary", "books", "art_supplies", "home_goods", "apparel"];
export const TAG_POOL = [
  "handmade",
  "bestseller",
  "limited_stock",
  "small_batch",
  "restocked",
  "archival",
  "gift_wrapped",
];

// Each image slot: { file: File|null, previewUrl: string, existingUrl: string }
// file+previewUrl = newly selected local file; existingUrl = already-uploaded URL (edit mode)
const blankSlot = () => ({ file: null, previewUrl: "", existingUrl: "" });

const blank = {
  productName: "",
  description: "",
  price: "",
  stock: "",
  category: CATEGORIES[0],
  imageSlots: [blankSlot()],
  sku: "",
  tags: [],
  specifications: [
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
  ],
  returns_note: "",
};

const padSpecs = (specs) => {
  const list = [...(specs ?? [])].map((s) => ({ label: s.label, value: s.value }));
  while (list.length < 3) list.push({ label: "", value: "" });
  return list;
};

export default function ProductFormModal({ open, product, onClose, onSubmit }) {
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(
      product
        ? {
            productName: product.productName,
            description: product.description ?? "",
            price: String(product.price),
            stock: String(product.stock),
            category: product.category,
            imageSlots: product.images?.length
              ? product.images.map((url) => ({ file: null, previewUrl: "", existingUrl: url }))
              : [blankSlot()],
            sku: product.sku ?? "",
            tags: product.tags ?? [],
            specifications: padSpecs(product.specifications),
            returns_note: product.returns_note ?? "",
          }
        : blank,
    );
  }, [open, product]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setSpec = (i, key) => (e) =>
    setForm((f) => ({
      ...f,
      specifications: f.specifications.map((s, idx) =>
        idx === i ? { ...s, [key]: e.target.value } : s,
      ),
    }));

  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));

  const setImageSlot = (i) => (file, previewUrl) =>
    setForm((f) => ({
      ...f,
      imageSlots: f.imageSlots.map((slot, idx) =>
        idx === i ? { file, previewUrl, existingUrl: "" } : slot,
      ),
    }));

  const addImageSlot = () =>
    setForm((f) => (f.imageSlots.length >= 3 ? f : { ...f, imageSlots: [...f.imageSlots, blankSlot()] }));

  const removeImageSlot = (i) =>
    setForm((f) => ({ ...f, imageSlots: f.imageSlots.filter((_, idx) => idx !== i) }));

  const validate = () => {
    if (!form.productName.trim()) return "Give the product a name.";
    if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) <= 0)
      return "Price must be a number above zero.";
    if (form.stock === "" || Number.isNaN(Number(form.stock)) || Number(form.stock) < 0)
      return "Stock must be zero or more.";
    const filledSlots = form.imageSlots.filter((s) => s.file || s.existingUrl);
    if (filledSlots.length < 1 || filledSlots.length > 3) return "Upload between 1 and 3 images.";
    if (
      form.specifications.some(
        (sp) => (sp.label.trim() && !sp.value.trim()) || (!sp.label.trim() && sp.value.trim()),
      )
    )
      return "Each specification needs both a label and a value.";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSaving(true);
    try {
      // Upload only newly selected files; keep already-uploaded URLs as-is
      const images = await Promise.all(
        form.imageSlots
          .filter((s) => s.file || s.existingUrl)
          .map((s) => (s.file ? uploadFile(s.file, "product") : Promise.resolve(s.existingUrl))),
      );
      await onSubmit({
        productName: form.productName.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        images,
        category: form.category,
        sku: form.sku.trim(),
        tags: form.tags,
        specifications: form.specifications.filter((sp) => sp.label.trim() && sp.value.trim()),
        returns_note: form.returns_note.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PaperModal
      open={open}
      onClose={() => !saving && onClose()}
      title={product ? "Edit product" : "Add a product"}
      description="Fill the slip in ink. Starred fields are required."
      size="lg"
      footer={
        <>
          <PaperButton disabled={saving} onClick={onClose}>
            Discard
          </PaperButton>
          <PaperButton variant="stamp" disabled={saving} onClick={submit}>
            {saving ? "Filing…" : product ? "Save changes" : "Add product"}
          </PaperButton>
        </>
      }
    >
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <PaperInput
            label="Product name"
            required
            value={form.productName}
            onChange={set("productName")}
          />
        </div>
        <div className="sm:col-span-2">
          <PaperTextarea
            label="Description"
            value={form.description}
            onChange={set("description")}
            hint="What is it made of, how big is it, how does it feel?"
          />
        </div>
        <PaperInput
          label="Price (USD)"
          required
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={set("price")}
        />
        <PaperInput
          label="Stock"
          required
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={set("stock")}
        />
        <PaperSelect label="Category" required value={form.category} onChange={set("category")}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c.replace("_", " ")}
            </option>
          ))}
        </PaperSelect>
        <PaperInput
          label="Product code (SKU)"
          value={form.sku}
          onChange={set("sku")}
          hint="Printed on the receipt stub."
        />

        <div className="sm:col-span-2">
          <p className="mb-1 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Images (1–3)
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {form.imageSlots.map((slot, i) => (
              <div key={i} className="flex items-end gap-2">
                <ImageUploadField
                  label={`Image ${i + 1}`}
                  value={slot.existingUrl}
                  previewUrl={slot.previewUrl}
                  onChange={setImageSlot(i)}
                />
                {form.imageSlots.length > 1 && (
                  <PaperButton type="button" size="sm" variant="danger" onClick={() => removeImageSlot(i)}>
                    Remove
                  </PaperButton>
                )}
              </div>
            ))}
          </div>
          {form.imageSlots.length < 3 && (
            <PaperButton type="button" size="sm" className="mt-2" onClick={addImageSlot}>
              + Add another image
            </PaperButton>
          )}
        </div>

        <div className="sm:col-span-2">
          <p className="mb-1 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Tags
          </p>
          <div className="flex flex-wrap gap-2">
            {TAG_POOL.map((tag) => {
              const on = form.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleTag(tag)}
                  className={
                    "rounded-[2px] border px-2 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors " +
                    (on
                      ? "border-kraft bg-kraft/15 text-kraft"
                      : "border-dashed border-paper-edge bg-paper-2 text-ink-faint hover:text-ink-2")
                  }
                >
                  {tag.replace("_", " ")}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-1 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
            Specifications
          </p>
          <div className="grid gap-2">
            {form.specifications.map((sp, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-2">
                <PaperInput
                  label={`Label ${i + 1}`}
                  value={sp.label}
                  onChange={setSpec(i, "label")}
                  placeholder="Material"
                />
                <PaperInput
                  label={`Value ${i + 1}`}
                  value={sp.value}
                  onChange={setSpec(i, "value")}
                  placeholder="Cotton rag, 120gsm"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <PaperTextarea
            label="Shipping & returns note"
            value={form.returns_note}
            onChange={set("returns_note")}
            hint="Stamped on the product page."
          />
        </div>

        {error && (
          <p role="alert" className="sm:col-span-2 font-hand text-lg leading-tight text-ink-red">
            ↳ {error}
          </p>
        )}
        {saving && (
          <div className="sm:col-span-2">
            <PaperSpinner label="filing the slip…" />
          </div>
        )}
        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
      </form>
    </PaperModal>
  );
}
