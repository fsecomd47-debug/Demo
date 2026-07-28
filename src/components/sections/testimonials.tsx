"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { testimonials } from "@/lib/clinic-data";
import { cn } from "@/lib/design-system";

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => {
      const next = prev + newDirection;
      if (next < 0) return testimonials.length - 1;
      if (next >= testimonials.length) return 0;
      return next;
    });
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="relative py-12 sm:py-24 lg:py-32 bg-muted/50 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent mb-4">
            <Quote className="h-4 w-4" />
            Testimonials
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            What Our{" "}
            <span className="text-gradient">Patients Say</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted text-sm sm:text-lg">
            Real stories from real patients who trust us with their smiles.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl bg-white p-5 shadow-premium-lg sm:p-8 md:p-12">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-center"
              >
                <Quote className="mx-auto h-10 w-10 text-accent/30 mb-6" />
                <p className="text-lg leading-relaxed text-text/80 md:text-xl italic">
                  &ldquo;{testimonials[current].content}&rdquo;
                </p>

                <div className="mt-6 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < testimonials[current].rating
                          ? "fill-accent text-accent"
                          : "fill-gray-200 text-gray-200"
                      )}
                    />
                  ))}
                </div>

                <div className="mt-6">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gradient-premium flex items-center justify-center text-white font-bold">
                    {testimonials[current].name.charAt(0)}
                  </div>
                  <h4 className="mt-3 font-semibold text-text">{testimonials[current].name}</h4>
                  <p className="text-sm text-text-muted">{testimonials[current].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-premium hover:shadow-premium-lg transition-shadow text-text hover:text-primary"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    i === current ? "w-8 bg-secondary" : "w-2.5 bg-border hover:bg-border/80"
                  )}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => navigate(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-premium hover:shadow-premium-lg transition-shadow text-text hover:text-primary"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
