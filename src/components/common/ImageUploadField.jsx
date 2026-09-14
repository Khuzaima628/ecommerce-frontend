import { useRef, useState } from "react";
import { uploadFile } from "../../lib/mediaApi.js";
import PaperButton from "../paper/PaperButton.jsx";

/**
 * Presigned-URL upload per auth_company_product.md: ask the backend for
 * {uploadUrl, fileUrl}, PUT the raw bytes to uploadUrl, then keep fileUrl.
 */
export default function ImageUploadField({ label, folder, value, onChange, hint }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pick = () => inputRef.current?.click();

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const fileUrl = await uploadFile(file, folder);
      onChange(fileUrl);
    } catch (err) {
      setError(err.message ?? "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <p className="mb-1 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
        {label}
      </p>
      <div className="flex items-center gap-3">
        {value && (
          <img
            src={value}
            alt=""
            className="h-14 w-14 shrink-0 border border-paper-edge object-cover"
          />
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={handleFile}
        />
        <PaperButton type="button" size="sm" disabled={uploading} onClick={pick}>
          {uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </PaperButton>
      </div>
      {hint && !error && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 font-hand text-lg leading-tight text-ink-red">
          ↳ {error}
        </p>
      )}
    </div>
  );
}
