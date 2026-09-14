import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

export const TOAST_DURATION = 3600;

/**
 * One shared notice board for the whole desk. Any component, in any role's
 * flow, raises a sticky note through `toast()`.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    const t = timers.current.get(id);
    if (t) clearTimeout(t);
    timers.current.set(
      id,
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
        timers.current.delete(id);
      }, 200),
    );
  }, []);

  const toast = useCallback(
    (message, options = {}) => {
      counter.current += 1;
      const id = `t-${counter.current}`;
      const entry = {
        id,
        message,
        tone: options.tone === "warning" ? "warning" : "kraft",
        note: options.note ?? null,
        leaving: false,
      };
      setToasts((prev) => [...prev.slice(-3), entry]);
      timers.current.set(id, setTimeout(() => dismiss(id), TOAST_DURATION));
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
