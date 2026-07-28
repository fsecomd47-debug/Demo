"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export function ToastContainer() {
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const idCounter = useRef(0);

  const addToast = useCallback((message: string) => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => addToast((e as CustomEvent).detail);
    window.addEventListener("toast:show", handler);
    return () => window.removeEventListener("toast:show", handler);
  }, [addToast]);

  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)]"
          >
            <CheckCircle className="h-4 w-4 text-[#22C55E] shrink-0" />
            <span className="text-sm font-medium text-[#0F172A]">{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="ml-2 text-[#9CA3AF] hover:text-[#0F172A] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
