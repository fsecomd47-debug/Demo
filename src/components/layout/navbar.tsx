"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { cn } from "@/lib/design-system";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 pt-3 transition-all duration-300"
      )}
    >
      <nav className={cn(
        "mx-auto max-w-7xl flex items-center justify-between transition-all duration-300",
        "bg-white/70 backdrop-blur-xl border border-[rgba(0,0,0,0.06)]",
        scrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.08)]" : "shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
        "rounded-[28px] px-5 md:px-7 py-3"
      )}>
        <a href="#hero" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F172A] text-white font-bold text-sm tracking-tight">
              P
            </div>
            <div>
              <span className="text-base font-bold text-[#0F172A] tracking-tight">Panthi Dental</span>
              <span className="block text-[9px] uppercase tracking-[0.15em] text-[#6B7280]">Clinic</span>
            </div>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm font-medium text-[#6B7280] hover:text-[#0F172A] rounded-full hover:bg-[rgba(0,0,0,0.03)] transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:984-7857569"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#0F172A] transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden xl:inline">984-7857569</span>
          </a>
          <a
            href="#booking"
            className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-[#1e293b] hover:shadow-[0_4px_15px_rgba(15,23,42,0.2)]"
          >
            Book Appointment
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <button
          className="lg:hidden p-2 text-[#0F172A]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-7xl px-2 mt-1"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-[rgba(0,0,0,0.06)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden">
              <div className="flex flex-col gap-1 p-3">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#0F172A] hover:bg-[rgba(0,0,0,0.03)] transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <div className="flex gap-2 pt-2 border-t border-[rgba(0,0,0,0.06)] mt-1">
                  <a href="tel:984-7857569" className="flex-1">
                    <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[rgba(0,0,0,0.08)] text-sm font-medium text-[#0F172A] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
                      <Phone className="w-4 h-4" /> Call
                    </div>
                  </a>
                  <a href="#booking" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1e293b] transition-colors">
                      Book <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
