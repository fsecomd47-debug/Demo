"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle, MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/design-system";

const transformations = [
  {
    id: "whitening",
    title: "Teeth Whitening",
    description: "Professional whitening transforming stained teeth into a bright, radiant smile.",
    before: { color: "from-gray-700 to-gray-500", emoji: "😬", label: "Stained Teeth" },
    after: { color: "from-secondary to-secondary-light", emoji: "😁", label: "Bright Smile" },
    results: ["Removed years of staining", "Brightened 8 shades", "Natural-looking results"],
  },
  {
    id: "braces",
    title: "Braces Treatment",
    description: "Complete orthodontic correction for perfectly aligned teeth and improved bite.",
    before: { color: "from-gray-700 to-gray-500", emoji: "😐", label: "Misaligned Teeth" },
    after: { color: "from-secondary to-secondary-light", emoji: "😁", label: "Perfect Alignment" },
    results: ["Corrected overcrowding", "Fixed bite alignment", "12-month treatment"],
  },
  {
    id: "implant",
    title: "Dental Implant",
    description: "Full restoration of missing tooth with a natural-looking permanent implant.",
    before: { color: "from-gray-700 to-gray-500", emoji: "😕", label: "Missing Tooth" },
    after: { color: "from-secondary to-secondary-light", emoji: "😁", label: "Restored Smile" },
    results: ["Permanent solution", "Natural appearance", "Full function restored"],
  },
  {
    id: "veneer",
    title: "Porcelain Veneers",
    description: "Custom-crafted veneers that create a flawless, celebrity-quality smile makeover.",
    before: { color: "from-gray-700 to-gray-500", emoji: "😶", label: "Uneven Teeth" },
    after: { color: "from-secondary to-secondary-light", emoji: "😁", label: "Flawless Smile" },
    results: ["Complete smile makeover", "Stain-resistant", "Instant transformation"],
  },
];

function BeforeAfterSlider({ t }: { t: typeof transformations[number] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging) updatePosition(e.clientX);
  };

  const onPointerUp = () => setDragging(false);

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none shadow-premium-lg cursor-ew-resize"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{ touchAction: "none" }}
      >
        <div className={cn("absolute inset-0 bg-gradient-to-br", t.after.color)}>
          <div className="flex flex-col items-center justify-center h-full p-8">
            <span className="text-7xl mb-4">{t.after.emoji}</span>
            <span className="text-white/80 text-lg font-medium">{t.after.label}</span>
          </div>
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div className={cn("w-full h-full bg-gradient-to-br", t.before.color)}>
            <div className="flex flex-col items-center justify-center h-full p-8">
              <span className="text-7xl mb-4">{t.before.emoji}</span>
              <span className="text-white/80 text-lg font-medium">{t.before.label}</span>
            </div>
          </div>
        </div>

        <div
          className="absolute top-0 bottom-0 w-0.5"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="h-full w-full bg-white/80 shadow-lg" />
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "flex items-center justify-center",
              "w-12 h-12 rounded-full",
              "bg-white shadow-premium-lg",
              "cursor-grab active:cursor-grabbing",
              dragging ? "ring-4 ring-accent/40 scale-110" : ""
            )}
            onPointerDown={onPointerDown}
          >
            <MoveHorizontal className={cn("h-5 w-5 transition-colors", dragging ? "text-accent" : "text-primary")} />
          </motion.div>
        </div>

        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 text-xs font-medium">
          Before
        </div>
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 text-xs font-medium">
          After
        </div>
      </div>

      <p className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5">
        <MoveHorizontal className="h-3.5 w-3.5" />
        Drag the slider to compare before and after
      </p>
    </div>
  );
}

export function Transformations() {
  const [active, setActive] = useState(transformations[0].id);

  return (
    <section className="relative py-12 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-white to-muted/30">
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
            <Sparkles className="h-4 w-4" />
            Transformations
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Real Smiles,{" "}
            <span className="text-gradient">Real Results</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted text-sm sm:text-lg">
            See the difference expert dental care makes. Slide to compare before and after transformations.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:flex-col lg:col-span-2 gap-3">
            {transformations.map((t) => (
              <motion.button
                key={t.id}
                whileHover={{ x: 4 }}
                onClick={() => setActive(t.id)}
                className={cn(
                  "w-full text-left rounded-xl p-3 sm:p-4 transition-all duration-300 border-2",
                  active === t.id
                    ? "border-secondary bg-secondary/5 shadow-premium"
                    : "border-transparent bg-white hover:border-border hover:shadow-premium"
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={cn(
                    "flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg text-sm sm:text-lg transition-colors",
                    active === t.id ? "bg-secondary text-white" : "bg-muted"
                  )}>
                    {t.after.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("font-semibold sm:font-bold text-xs sm:text-sm lg:text-base", active === t.id ? "text-secondary" : "text-text")}>
                      {t.title}
                    </h4>
                    <p className="hidden lg:block text-xs text-text-muted leading-snug mt-0.5">{t.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {transformations
                .filter((t) => t.id === active)
                .map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <BeforeAfterSlider t={t} />

                    <div className="mt-6 rounded-xl bg-white p-5 shadow-premium">
                      <h5 className="font-bold text-text mb-3 text-center">{t.title} — Key Results</h5>
                      <div className="grid grid-cols-3 gap-3">
                        {t.results.map((r) => (
                          <div key={r} className="flex flex-col items-center gap-1.5 text-center">
                            <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                            <span className="text-xs text-text-muted leading-tight">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
