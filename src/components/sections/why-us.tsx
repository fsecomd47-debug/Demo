"use client";

import { motion } from "framer-motion";
import { Microscope, Users, ShieldCheck, Smile, Sparkles, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/design-system";

const reasons = [
  {
    icon: Microscope,
    title: "Modern Technology",
    description: "State-of-the-art digital X-rays, laser dentistry, and advanced equipment for precise diagnostics and treatments.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Experienced Team",
    description: "Our skilled dentists and friendly staff are committed to continuous learning and providing the best care possible.",
    color: "from-secondary to-secondary-light",
  },
  {
    icon: ShieldCheck,
    title: "Sterilization & Safety",
    description: "We follow rigorous sterilization protocols and strict safety standards to ensure a clean, safe environment.",
    color: "from-emerald-500 to-green-500",
  },
  {
    icon: Smile,
    title: "Comfortable Experience",
    description: "From soothing music to sedation options, we ensure every visit is as comfortable and stress-free as possible.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "Affordable Care",
    description: "Quality dental care should be accessible. We offer competitive pricing and flexible payment options.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: HeartHandshake,
    title: "Patient-Centered Approach",
    description: "We listen to your concerns, explain every step, and tailor treatments to your unique needs and goals.",
    color: "from-red-500 to-rose-500",
  },
];

export function WhyUs() {
  return (
    <section className="relative py-12 sm:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/5 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary mb-4">
            <HeartHandshake className="h-4 w-4" />
            Why Choose Us
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Why Patients{" "}
            <span className="text-gradient">Trust Us</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted text-sm sm:text-lg">
            We go beyond treatment to provide an exceptional dental experience.
          </p>
        </motion.div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group rounded-xl bg-white p-6 shadow-premium border border-border/40 hover:border-transparent transition-all duration-300"
            >
              <div className={cn("mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br", reason.color, "shadow-lg")}>
                <reason.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
