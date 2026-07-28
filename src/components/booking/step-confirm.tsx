"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone, Mail, FileText, MapPin } from "lucide-react";
import { services, clinicInfo } from "@/lib/clinic-data";

interface StepConfirmProps {
  data: {
    service: string;
    date: string;
    time: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
  };
}

export function StepConfirm({ data }: StepConfirmProps) {
  const service = services.find((s) => s.id === data.service);

  const items = [
    { icon: Calendar, label: "Service", value: service?.title || "Not selected" },
    { icon: Clock, label: "Date", value: data.date },
    { icon: Clock, label: "Time", value: data.time },
    { icon: User, label: "Name", value: data.name },
    { icon: Phone, label: "Phone", value: data.phone },
    { icon: Mail, label: "Email", value: data.email || "Not provided" },
    { icon: MapPin, label: "Location", value: clinicInfo.address },
  ];

  return (
    <div>
      <h4 className="text-lg font-bold text-primary mb-4">Review your appointment</h4>
      <p className="text-sm text-text-muted mb-6">
        Please verify your details before confirming. Click &quot;Book Appointment&quot; to finalize.
      </p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        className="rounded-xl bg-muted p-4 sm:p-6 space-y-3 sm:space-y-4"
      >
        {items.map((item) => (
          <motion.div
            key={item.label}
            variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
            className="flex items-center gap-3"
          >
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-secondary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] sm:text-xs text-text-muted">{item.label}</p>
              <p className="text-xs sm:text-sm font-medium text-text break-words">{item.value}</p>
            </div>
          </motion.div>
        ))}

        {data.notes && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-3 pt-2 border-t border-border"
          >
            <FileText className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-text-muted">Notes</p>
              <p className="text-sm text-text">{data.notes}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
