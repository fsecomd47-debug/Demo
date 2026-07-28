"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { services } from "@/lib/clinic-data";
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

interface StepServiceProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function StepService({ selected, onSelect }: StepServiceProps) {
  return (
    <div>
      <h4 className="text-lg font-bold text-primary mb-4">What brings you in today?</h4>
      <p className="text-sm text-text-muted mb-6">Select the service you need.</p>
      <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        {services.map((service, i) => {
          const IconComp = iconMap[service.icon] || Icons.Stethoscope;
          const isSelected = selected === service.id;

          return (
              <motion.button
                  key={service.id}
                  data-service-id={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelect(service.id)}
                  className={cn(
                "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-300",
                isSelected
                  ? "border-secondary bg-secondary/5 shadow-premium"
                  : "border-border bg-white hover:border-secondary/30 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                isSelected ? "bg-secondary text-white" : "bg-muted text-text-muted"
              )}>
                <IconComp className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h5 className={cn("font-semibold", isSelected ? "text-secondary" : "text-text")}>
                  {service.title}
                </h5>
                <p className="text-xs text-text-muted mt-1 line-clamp-2">{service.description}</p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary"
                >
                  <Icons.Check className="h-3.5 w-3.5 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
