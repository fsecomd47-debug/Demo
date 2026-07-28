"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/clinic-data";
import * as Icons from "lucide-react";
import { cn } from "@/lib/design-system";

const iconMap: Record<string, React.ComponentType<any>> = {
  Stethoscope: Icons.Stethoscope,
  Smile: Icons.Smile,
  Award: Icons.Award,
  Sparkles: Icons.Sparkles,
  Heart: Icons.Heart,
  Gem: Icons.Gem,
  Activity: Icons.Activity,
  Baby: Icons.Baby,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Services() {
  return (
    <section id="services" className="relative py-12 sm:py-24 lg:py-32 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Icons.Stethoscope className="h-4 w-4" />
            Our Services
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Comprehensive Dental Care,{" "}
            <span className="text-gradient">One Smile at a Time</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted text-sm sm:text-lg">
            From routine checkups to advanced cosmetic procedures, we offer everything you need for a healthy, beautiful smile.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
            className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || Icons.Stethoscope;
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className={cn(
                  "group rounded-xl bg-white p-6 shadow-premium transition-all duration-300",
                  "hover:shadow-premium-lg hover:border-secondary/30 border border-transparent"
                )}
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 group-hover:from-secondary group-hover:to-secondary-light transition-all duration-300">
                  <IconComponent className="h-7 w-7 text-secondary group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {service.description}
                </p>

                <ul className="mt-4 space-y-1.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-text-muted">
                      <Icons.Check className="h-3.5 w-3.5 text-secondary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <Icons.ArrowRight className="h-3.5 w-3.5" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
