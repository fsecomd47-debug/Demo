"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import { gallery } from "@/lib/clinic-data";
import { cn } from "@/lib/design-system";

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, close]);

  return (
    <section id="gallery" className="relative py-12 sm:py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
            <ImageIcon className="h-4 w-4" />
            Gallery
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Our{" "}
            <span className="text-gradient">Clinic</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted text-sm sm:text-lg">
            Take a virtual tour of our modern, comfortable facility.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {gallery.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelected(i)}
              className={cn(
                "group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl bg-gradient-premium",
                i === 0 && "md:col-span-2 md:row-span-2"
              )}
            >
              <div className="absolute inset-0 bg-gradient-premium flex items-center justify-center">
                <div className="text-center p-6">
                  <ImageIcon className="mx-auto h-10 w-10 text-white/40 mb-2" />
                  <p className="text-white/60 text-sm font-medium">{item.alt}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="rounded-full bg-white/90 p-3 text-primary">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            aria-label="Close gallery"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-premium"
              role="dialog"
              aria-modal="true"
              aria-label={gallery[selected]?.alt ?? "Gallery image"}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white/60 text-lg">{gallery[selected]?.alt}</p>
              </div>
              <button
                onClick={close}
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
