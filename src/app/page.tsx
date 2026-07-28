"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { WhyUs } from "@/components/sections/why-us";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Gallery } from "@/components/sections/gallery";
import { Transformations } from "@/components/sections/transformations";
import { Contact } from "@/components/sections/contact";
import { BookingWizard } from "@/components/booking/booking-wizard";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <About />
      <Stats />
      <Services />
      <WhyUs />
      <Testimonials />
      <Gallery />
      <Transformations />

      <section id="booking" className="relative py-12 sm:py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-muted/50 to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary mb-4">
              <Calendar className="h-4 w-4" />
              Book Appointment
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
              Ready to{" "}
              <span className="text-gradient">Transform Your Smile?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-muted text-sm sm:text-lg">
              Book your appointment in just a few clicks. Choose your service, pick a time, and we will take care of the rest.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl"
          >
            <BookingWizard />
          </motion.div>
        </div>
      </section>

      <Contact />
    </>
  );
}
