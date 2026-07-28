"use client";

import { Heart, Phone, Mail, MapPin, Clock, Globe } from "lucide-react";
import { clinicInfo } from "@/lib/clinic-data";

export function Footer() {
  return (
    <footer className="bg-gradient-premium text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 font-bold text-lg">
                P
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading">{clinicInfo.name}</h3>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              {clinicInfo.description.slice(0, 120)}...
            </p>
            <div className="flex gap-3">
              <a
                href={clinicInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ["Home", "#hero"],
                ["Services", "#services"],
                ["About Us", "#about"],
                ["Testimonials", "#testimonials"],
                ["Book Appointment", "#booking"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading">Services</h3>
            <ul className="space-y-2">
              {[
                "General Dentistry",
                "Orthodontics",
                "Dental Implants",
                "Teeth Whitening",
                "Root Canal",
                "Cosmetic Dentistry",
              ].map((service) => (
                <li key={service}>
                  <a href="#services" className="text-sm text-white/70 hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold font-heading">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">{clinicInfo.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <a href={`tel:${clinicInfo.phone}`} className="text-sm text-white/70 hover:text-white transition-colors">
                  {clinicInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <a href={`mailto:${clinicInfo.email}`} className="text-sm text-white/70 hover:text-white transition-colors">
                  {clinicInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div className="text-sm text-white/70">
                  {clinicInfo.hours.map((h) => (
                    <p key={h.day}>
                      {h.day}: {h.time}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/50 flex items-center justify-center gap-1">
            &copy; {new Date().getFullYear()} {clinicInfo.name}. All rights reserved. Made with
            <Heart className="h-4 w-4 text-red-400 fill-red-400" /> in Ghorahi, Nepal.
          </p>
        </div>
      </div>
    </footer>
  );
}
