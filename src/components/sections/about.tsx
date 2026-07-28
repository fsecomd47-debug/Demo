"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Users, Syringe, BadgeCheck } from "lucide-react";
import { clinicInfo } from "@/lib/clinic-data";
import { cn } from "@/lib/design-system";

const features = [
  { icon: Award, title: "10+ Years Experience", description: "Decade of trusted dental excellence in Ghorahi" },
  { icon: Users, title: "5000+ Happy Patients", description: "Thousands of smiles transformed with care" },
  { icon: Syringe, title: "Modern Technology", description: "Latest equipment for pain-free treatments" },
  { icon: BadgeCheck, title: "Expert Team", description: "Skilled specialists dedicated to your smile" },
];

export function About() {
  return (
    <section id="about" className="relative py-12 sm:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-8 sm:gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/doctor-founder.jpg"
                  alt="Dr. Sagar Panthi - Founder & Chief Dental Surgeon"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white font-heading">Dr. Sagar Panthi</h3>
                  <p className="text-sm text-white/80">Founder & Chief Dental Surgeon</p>
                </div>
              </div>
              <div className="absolute -bottom-3 sm:-bottom-6 -right-3 sm:-right-6 h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-accent/20 border border-accent/30 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-accent">5000+</div>
                  <div className="text-[10px] sm:text-xs text-accent/80">Smiles</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
              <Award className="h-4 w-4" />
              About Us
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Where Advanced Technology Meets{" "}
              <span className="text-gradient">Compassionate Care</span>
            </h2>

            <p className="text-base leading-relaxed text-text-muted">
              {clinicInfo.story}
            </p>

            <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3 sm:gap-4 pt-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "rounded-xl p-4 border transition-all duration-300",
                    "border-border/50 hover:border-secondary/30 hover:bg-secondary/5"
                  )}
                >
                  <feature.icon className="h-6 w-6 text-secondary mb-2" />
                  <h4 className="font-semibold text-sm text-text">{feature.title}</h4>
                  <p className="text-xs text-text-muted mt-1">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
