"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/clinic-data";
import { cn } from "@/lib/design-system";
import { StepService } from "./step-service";
import { StepDateTime } from "./step-datetime";
import { StepDetails } from "./step-details";
import { StepConfirm } from "./step-confirm";

const steps = [
  { number: 1, title: "Service", description: "Choose treatment" },
  { number: 2, title: "Date & Time", description: "Pick schedule" },
  { number: 3, title: "Your Details", description: "Personal info" },
  { number: 4, title: "Confirm", description: "Review & book" },
];

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 300 : -300,
    opacity: 0,
    rotateY: dir > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    rotateY: 0,
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -300 : 300,
    opacity: 0,
    rotateY: dir > 0 ? -15 : 15,
  }),
};

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());

  const scrollBooking = () => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const advanceTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    const clearAllTimers = () => {
      for (const t of advanceTimers.current) clearTimeout(t);
      advanceTimers.current = [];
    };

    const scheduleStep = (target: number, delay: number) => {
      const timer = setTimeout(() => {
        setDirection(target > stepRef.current ? 1 : -1);
        setStep(target);
        scrollBooking();
        advanceTimers.current = advanceTimers.current.filter((t) => t !== timer);
      }, delay);
      advanceTimers.current.push(timer);
      return timer;
    };

    const onFill = (e: CustomEvent<Record<string, string>>) => {
      const data = e.detail;
      clearAllTimers();
      const filled = new Set<string>();
      setFormData((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(data)) {
          if (key in next) {
            (next as any)[key] = data[key];
            filled.add(key);
          }
        }
        return next;
      });
      setHighlightedFields(filled);
      setTimeout(() => setHighlightedFields(new Set()), 1500);

      const s = stepRef.current;
      let delay = 800;
      if (data.service && s < 2) {
        scheduleStep(2, delay);
        delay += 800;
      }
      if ((data.date || data.time) && s < 3) {
        scheduleStep(3, delay);
        delay += 800;
      }
      if (data.name && data.phone && s < 4) {
        scheduleStep(4, delay);
      }
    };
    const onNext = () => {
      clearAllTimers();
      setDirection(1);
      setStep((prev) => Math.min(prev + 1, 4));
      scrollBooking();
    };
    const onPrev = () => {
      clearAllTimers();
      setDirection(-1);
      setStep((prev) => Math.max(prev - 1, 1));
      scrollBooking();
    };
    const onSubmit = async () => {
      clearAllTimers();
      setDirection(1);
      try {
        await Promise.allSettled([
          fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }),
          fetch("/api/calendar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }),
        ]);
      } catch {}
      setCompleted(true);
    };
    window.addEventListener("booking:fill", onFill as EventListener);
    window.addEventListener("booking:next", onNext);
    window.addEventListener("booking:prev", onPrev);
    window.addEventListener("booking:submit", onSubmit);
    return () => {
      window.removeEventListener("booking:fill", onFill as EventListener);
      window.removeEventListener("booking:next", onNext);
      window.removeEventListener("booking:prev", onPrev);
      window.removeEventListener("booking:submit", onSubmit);
      clearAllTimers();
    };
  }, []);

  const goNext = () => {
    setDirection(1);
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const goBack = () => {
    setDirection(-1);
    if (step > 1) setStep((prev) => prev - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.service;
      case 2: return !!formData.date && !!formData.time;
      case 3: return formData.name.length >= 2 && formData.phone.length >= 7;
      default: return true;
    }
  };

  const reset = () => {
    setStep(1);
    setDirection(1);
    setCompleted(false);
    setFormData({ service: "", date: "", time: "", name: "", phone: "", email: "", notes: "" });
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-white p-8 shadow-premium-lg text-center md:p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary/10"
        >
          <CheckCircle className="h-10 w-10 text-secondary" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-primary font-heading"
        >
          Appointment Booked!
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-text-muted"
        >
          We will confirm your appointment shortly via phone or email.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 rounded-xl bg-muted p-4 text-left space-y-1"
        >
          <p className="text-sm"><strong>Service:</strong> {services.find((s) => s.id === formData.service)?.title}</p>
          <p className="text-sm"><strong>Date:</strong> {formData.date}</p>
          <p className="text-sm"><strong>Time:</strong> {formData.time}</p>
          <p className="text-sm"><strong>Name:</strong> {formData.name}</p>
          <p className="text-sm"><strong>Phone:</strong> {formData.phone}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex justify-center gap-3"
        >
          <Button variant="outline" onClick={reset}>
            Book Another
          </Button>
        </motion.div>

        <div className="mt-4 flex justify-center gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -10 }}
              animate={{
                opacity: [0, 1, 0],
                y: [-10, -30, -50],
              }}
              transition={{
                delay: 0.8 + i * 0.15,
                duration: 1.2,
                repeat: 0,
              }}
            >
              <PartyPopper className="h-5 w-5 text-accent" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-3 min-[400px]:p-4 sm:p-6 shadow-premium-lg md:p-10">
      <div className="mb-4 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-secondary shrink-0" />
          <h3 className="text-lg sm:text-xl font-bold text-primary font-heading">Book Your Appointment</h3>
        </div>
        <p className="text-xs sm:text-sm text-text-muted">Complete the steps below to schedule your visit.</p>
      </div>

      <div className="mb-4 sm:mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <motion.div
                  layout
                  animate={{
                    scale: step === s.number ? 1.1 : 1,
                    backgroundColor: step > s.number ? "#0D9488" : step === s.number ? "var(--color-primary)" : "#F3F4F6",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={cn(
                    "flex h-7 w-7 min-[400px]:h-8 min-[400px]:w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full text-[10px] min-[400px]:text-xs sm:text-sm font-bold",
                    step === s.number && "shadow-glow text-white",
                    step > s.number ? "text-white" : step < s.number ? "text-text-muted" : "text-white"
                  )}
                >
                  {step > s.number ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                  ) : (
                    s.number
                  )}
                </motion.div>
                <div className="hidden sm:block mt-1.5 text-center">
                  <motion.p
                    animate={{ color: step >= s.number ? "var(--color-text)" : "#9CA3AF" }}
                    className="text-xs font-semibold"
                  >
                    {s.title}
                  </motion.p>
                  <p className="text-[10px] text-text-muted">{s.description}</p>
                </div>
              </div>
              {i < steps.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor: step > s.number ? "#0D9488" : "#E5E7EB",
                  }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 h-0.5 mx-0.5 min-[400px]:mx-1 sm:mx-2 sm:mt-[-1.5rem]"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="min-h-[260px] sm:min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {step === 1 && (
              <StepService selected={formData.service} onSelect={(v) => { updateField("service", v); setTimeout(goNext, 300); }} />
            )}
            {step === 2 && (
              <StepDateTime date={formData.date} time={formData.time} onUpdate={updateField} />
            )}
            {step === 3 && (
              <StepDetails data={{ name: formData.name, phone: formData.phone, email: formData.email, notes: formData.notes }} onUpdate={updateField} highlightedFields={highlightedFields} />
            )}
            {step === 4 && (
              <StepConfirm data={formData} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
        <Button
          variant="ghost"
          onClick={goBack}
          disabled={step === 1}
          className={step === 1 ? "invisible" : ""}
        >
          ← Back
        </Button>

        <div className="text-sm text-text-muted">
          Step {step} of 4
        </div>

        {step < 4 ? (
          <Button onClick={goNext} disabled={!canProceed()}>
            Continue →
          </Button>
        ) : (
          <Button onClick={goNext} variant="accent" icon={<Calendar className="h-5 w-5" />}>
            Book Appointment
          </Button>
        )}
      </div>
    </div>
  );
}
