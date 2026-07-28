"use client";

import { Input } from "@/components/ui/input";
import { User, Phone, Mail, FileText } from "lucide-react";

interface StepDetailsProps {
  data: { name: string; phone: string; email: string; notes: string };
  onUpdate: (field: string, value: string) => void;
  highlightedFields?: Set<string>;
}

export function StepDetails({ data, onUpdate, highlightedFields }: StepDetailsProps) {
  return (
    <div>
      <h4 className="text-lg font-bold text-primary mb-4">Tell us about yourself</h4>
      <p className="text-sm text-text-muted mb-6">We need a few details to confirm your appointment.</p>

      <div className="space-y-4 sm:space-y-5 max-w-md">
        <Input
          label="Full Name *"
          placeholder="Your full name"
          value={data.name}
          onChange={(e) => onUpdate("name", e.target.value)}
          icon={<User className="h-4 w-4" />}
          highlighted={highlightedFields?.has("name")}
        />
        <Input
          label="Phone Number *"
          placeholder="984-7857569"
          value={data.phone}
          onChange={(e) => onUpdate("phone", e.target.value)}
          icon={<Phone className="h-4 w-4" />}
          highlighted={highlightedFields?.has("phone")}
        />
        <Input
          label="Email Address"
          placeholder="your@email.com"
          type="email"
          value={data.email}
          onChange={(e) => onUpdate("email", e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          highlighted={highlightedFields?.has("email")}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text/80">
            Notes (Optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-4 w-4 text-text-muted" />
            <textarea
              placeholder="Any specific concerns or requests..."
              rows={3}
              value={data.notes}
              onChange={(e) => onUpdate("notes", e.target.value)}
              className="w-full rounded-lg border border-border bg-white pl-10 pr-4 py-3 text-text placeholder:text-text-muted/60 transition-all duration-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
