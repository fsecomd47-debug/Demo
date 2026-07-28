"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, animate } from "framer-motion";
import { Phone, ArrowRight, Sparkles } from "lucide-react";

function useCountUp(end: number, duration = 2) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const controls = animate(0, end, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => { el.textContent = Math.floor(v).toLocaleString(); },
    });
    return controls.stop;
  }, [end, duration]);
  return ref;
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#0F172A]"
    >
      {/* Hero Image - full background */}
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <Image
          src="/images/hero-image.png"
          alt="Panthi Dental Clinic"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark gradient overlay for readability */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: overlayOpacity }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-transparent" />
        </motion.div>
      </motion.div>

      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] z-[2]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00B5C8]" />
            <span className="text-xs font-medium text-white/70 tracking-wide">Panthi Dental Clinic · Ghorahi, Nepal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-['Inter'] text-[clamp(28px,8vw,40px)] sm:text-[clamp(40px,6vw,56px)] md:text-[72px] lg:text-[84px] font-bold leading-[1.05] tracking-[-0.03em] text-white"
          >
            Trusted Dental Care
            <br className="hidden min-[380px]:inline" />
            for Every{" "}
            <span className="font-['Playfair_Display'] italic font-normal text-[#00B5C8] tracking-normal">Generation</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mt-5 text-base sm:text-lg text-white/60 leading-relaxed max-w-lg"
          >
            Advanced dentistry in a warm, welcoming environment. 
            Where modern technology meets genuine care for your smile.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <a href="#booking" className="w-full sm:w-auto">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex min-h-[48px] items-center justify-center gap-2 bg-[#00B5C8] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 shadow-[0_4px_20px_rgba(0,181,200,0.3)] hover:shadow-[0_8px_30px_rgba(0,181,200,0.4)] w-full sm:w-auto"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.span>
            </a>
            <a href="tel:984-7857569" className="w-full sm:w-auto">
              <motion.span
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex min-h-[48px] items-center justify-center gap-2 border border-white/20 bg-white/5 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm font-semibold transition-all duration-300 hover:bg-white/10 w-full sm:w-auto"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </motion.span>
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-xs text-white/40 flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-[#00B5C8]" />
            Trusted by 5,000+ families across Dang District
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-3 sm:gap-x-8 md:gap-x-12"
          >
            <div className="text-center flex-1 min-w-[80px] sm:flex-none">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">5,000+</span>
              <span className="block text-[11px] sm:text-xs md:text-sm text-white/50 mt-0.5">Happy Patients</span>
            </div>
            <div className="text-center flex-1 min-w-[80px] sm:flex-none">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">15+</span>
              <span className="block text-[11px] sm:text-xs md:text-sm text-white/50 mt-0.5">Years Exp.</span>
            </div>
            <div className="text-center flex-1 min-w-[80px] sm:flex-none">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">4.9★</span>
              <span className="block text-[11px] sm:text-xs md:text-sm text-white/50 mt-0.5">Google Rating</span>
            </div>
            <div className="text-center flex-1 min-w-[80px] sm:flex-none">
              <span className="block text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">98%</span>
              <span className="block text-[11px] sm:text-xs md:text-sm text-white/50 mt-0.5">Satisfaction</span>
            </div>
          </motion.div>
        </div>
      </div>


    </section>
  );
}
