"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clinicInfo } from "@/lib/clinic-data";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || sending) return;
    setSending(true);
    try {
      await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, service: "Contact Form", date: "", time: "" }),
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-12 sm:py-24 lg:py-32 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Phone className="h-4 w-4" />
            Contact Us
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Get In{" "}
            <span className="text-gradient">Touch</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted text-sm sm:text-lg">
            Ready to transform your smile? Reach out to us today.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 rounded-2xl bg-white p-4 sm:p-8 shadow-premium-lg">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Your Name *"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    placeholder="john@example.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <Input
                  label="Phone Number"
                  placeholder="984-7857569"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-text/80">Message *</label>
                  <textarea
                    placeholder="Tell us how we can help you..."
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border bg-white px-4 py-3 text-text placeholder:text-text-muted/60 transition-all duration-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full" icon={<Send className="h-5 w-5" />}>
                  Send Message
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-premium-lg text-center"
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10">
                  <CheckCircle className="h-10 w-10 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Message Sent!</h3>
                <p className="mt-2 text-text-muted">We will get back to you within 24 hours.</p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-premium space-y-4 sm:space-y-6">
              {[
                { icon: MapPin, label: "Address", value: clinicInfo.address },
                { icon: Phone, label: "Phone", value: clinicInfo.phone, href: `tel:${clinicInfo.phone}` },
                { icon: Mail, label: "Email", value: clinicInfo.email, href: `mailto:${clinicInfo.email}` },
                {
                  icon: Clock,
                  label: "Working Hours",
                  value: (
                    <div>
                      {clinicInfo.hours.map((h) => (
                        <p key={h.day} className="text-sm">{h.day}: {h.time}</p>
                      ))}
                    </div>
                  ),
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">{label}</h4>
                    {href ? (
                      <a href={href} className="text-sm text-text-muted hover:text-secondary transition-colors">
                        {value}
                      </a>
                    ) : (
                      <div className="text-sm text-text-muted">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl h-64">
              <iframe
                src="https://www.google.com/maps?q=Panthi+Dental+Clinic+Ghorahi&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Panthi Dental Clinic Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
