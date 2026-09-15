import { useRef, useState } from "react";
import PaperButton from "../paper/PaperButton.jsx";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

/**
 * Stores the selected file locally and calls onChange(file, previewUrl).
 * No API call is made here — upload happens on form submit.
 */
export default function ImageUploadField({ label, value, previewUrl, onChange, hint }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const pick = () => inputRef.current?.click();

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PNG, JPEG or WEBP images are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File must be 5 MB or smaller.");
      return;
    }
    setError("");
    const preview = URL.createObjectURL(file);
    onChange(file, preview);
  };

  const displaySrc = previewUrl || (typeof value === "string" ? value : null);

  return (
    <div>
      <p className="mb-1 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
        {label}
      </p>
      <div className="flex items-center gap-3">
        {displaySrc && (
          <img
            src={displaySrc}
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
        <PaperButton type="button" size="sm" onClick={pick}>
          {displaySrc ? "Replace image" : "Choose image"}
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
