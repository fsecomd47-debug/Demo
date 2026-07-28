"use client";

import { motion } from "framer-motion";
import { CalendarCheck, Phone, Clock } from "lucide-react";
import { clinicInfo } from "@/lib/clinic-data";
import { cn } from "@/lib/design-system";

const items = [
  {
    icon: CalendarCheck,
    title: "Get An Appointment",
    description: "Book online or call us today",
    action: "Book Now",
    href: "#booking",
    color: "from-secondary to-secondary-light",
  },
  {
    icon: Phone,
    title: "Emergency Contact",
    description: "Available 24/7 for emergencies",
    action: clinicInfo.emergency,
    href: `tel:${clinicInfo.phone}`,
    color: "from-accent to-accent-light",
  },
  {
    icon: Clock,
    title: "Working Hours",
    description: (
      <>
        {clinicInfo.hours.map((h) => (
          <span key={h.day} className="block">
            {h.day}: {h.time}
          </span>
        ))}
      </>
    ),
    action: null,
    href: null,
    color: "from-primary-light to-primary",
  },
];

export function TrustBar() {
  return (
    <section className="relative z-20 -mt-16 mx-auto max-w-7xl px-4 lg:px-8">
      <div className="grid gap-3 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              "group rounded-xl bg-white p-6 shadow-premium-lg hover:shadow-premium-lg transition-all duration-300",
              item.href && "cursor-pointer"
            )}
            {...(item.href ? { onClick: () => { window.location.href = item.href as string; } } : {})}
          >
            <div className="flex items-start gap-4">
              <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br", item.color)}>
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text">{item.title}</h3>
                <div className="mt-1 text-sm text-text-muted">{item.description}</div>
                {item.action && (
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-secondary group-hover:gap-2 transition-all">
                    {item.action}
                    <span className="text-xs">→</span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
