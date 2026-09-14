import { useId } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-[2px] border border-paper-edge bg-paper-1 px-3 py-2 font-body text-sm text-ink-1 " +
  "shadow-[inset_0_2px_4px_rgba(90,75,50,0.13)] placeholder:text-ink-faint/70 " +
  "focus:border-ink-blue focus:outline-2 focus:outline-dashed focus:outline-ink-blue focus:outline-offset-1";

function Wrapper({ id, label, hint, error, required, children }) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1 block font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3"
      >
        {label}
        {required && <span className="ml-1 text-ink-red">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 -rotate-[0.6deg] font-hand text-lg leading-tight text-ink-red">
          ↳ {error}
        </p>
      )}
    </div>
  );
}

export default function PaperInput({ label, hint, error, className, id, ...rest }) {
  const auto = useId();
  const fieldId = id || auto;
  return (
    <Wrapper id={fieldId} label={label} hint={hint} error={error} required={rest.required}>
      <input
        id={fieldId}
        aria-invalid={error ? "true" : undefined}
        className={cn(fieldBase, error && "border-ink-red", className)}
        {...rest}
      />
    </Wrapper>
  );
}

export function PaperTextarea({ label, hint, error, className, id, ...rest }) {
  const auto = useId();
  const fieldId = id || auto;
  return (
    <Wrapper id={fieldId} label={label} hint={hint} error={error} required={rest.required}>
      <textarea
        id={fieldId}
        aria-invalid={error ? "true" : undefined}
        className={cn(fieldBase, "min-h-24 resize-y", error && "border-ink-red", className)}
        {...rest}
      />
    </Wrapper>
  );
}

/**
 * A from–to pair that reads as one field rather than two loose boxes.
 *
 * The two inputs share a single frame with an en dash between them, so
 * a range sits in the filter row at the same weight as a select instead
 * of sprawling across its own extra line.
 *
 * It is a `fieldset` with the visible caption as its `legend`, so the
 * grouping is announced rather than only drawn — each input still
 * carries its own label, kept for screen readers only.
 */
export function PaperRangeField({
  label,
  fromLabel = "From",
  toLabel = "To",
  hint,
  error,
  prefix,
  fromProps = {},
  toProps = {},
  className,
}) {
  const base = useId();
  const fromId = `${base}-from`;
  const toId = `${base}-to`;

  const cell =
    "w-full min-w-0 bg-transparent px-2 py-2 font-body text-sm text-ink-1 " +
    "placeholder:text-ink-faint/70 focus:outline-none " +
    "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none " +
    "[&::-webkit-outer-spin-button]:appearance-none";

  return (
    <fieldset className={cn("w-full min-w-0", className)}>
      <legend className="mb-1 block font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">
        {label}
      </legend>

      <div
        className={cn(
          "flex items-stretch rounded-[2px] border border-paper-edge bg-paper-1",
          "shadow-[inset_0_2px_4px_rgba(90,75,50,0.13)]",
          "focus-within:border-ink-blue focus-within:outline-2 focus-within:outline-dashed",
          "focus-within:outline-ink-blue focus-within:outline-offset-1",
          error && "border-ink-red",
        )}
      >
        <label htmlFor={fromId} className="sr-only">
          {fromLabel}
        </label>
        {prefix && (
          <span aria-hidden="true" className="self-center pl-2.5 text-sm text-ink-faint">
            {prefix}
          </span>
        )}
        <input id={fromId} type="number" aria-invalid={error ? "true" : undefined} className={cell} {...fromProps} />

        <span aria-hidden="true" className="self-center font-hand text-xl leading-none text-ink-faint">
          –
        </span>

        <label htmlFor={toId} className="sr-only">
          {toLabel}
        </label>
        {prefix && (
          <span aria-hidden="true" className="self-center pl-2.5 text-sm text-ink-faint">
            {prefix}
          </span>
        )}
        <input id={toId} type="number" aria-invalid={error ? "true" : undefined} className={cell} {...toProps} />
      </div>

      {hint && !error && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
      {error && (
        <p role="alert" className="mt-1 -rotate-[0.6deg] font-hand text-lg leading-tight text-ink-red">
          ↳ {error}
        </p>
      )}
    </fieldset>
  );
}

export function PaperSelect({ label, hint, error, className, id, children, ...rest }) {
  const auto = useId();
  const fieldId = id || auto;
  return (
    <Wrapper id={fieldId} label={label} hint={hint} error={error} required={rest.required}>
      <select
        id={fieldId}
        aria-invalid={error ? "true" : undefined}
        className={cn(fieldBase, "appearance-none pr-8", error && "border-ink-red", className)}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  );
}
