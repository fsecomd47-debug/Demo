"use client";

export function initWebsiteAPI() {
  if (typeof window === "undefined") return;

  const findInput = (field: string): HTMLInputElement | HTMLTextAreaElement | null => {
    return document.querySelector(
      `[name="${field}"], [data-field="${field}"]`
    ) as HTMLInputElement | null;
  };

  const typingIntervals = new Map<string, ReturnType<typeof setInterval>>();

  (window as any).website = {
    // ─── Navigation ───
    navigate(sectionId: string) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        this.highlightSection(sectionId);
      }
    },
    scrollToSection(id: string) {
      this.navigate(id);
    },
    openBooking() {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },

    // ─── Highlighting ───
    highlight(elementId: string) {
      this.highlightSection(elementId);
    },
    highlightSection(id: string) {
      const el = document.getElementById(id) || document.querySelector(`[data-section="${id}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.style.transition = "box-shadow 0.4s ease, transform 0.4s ease";
        el.style.boxShadow = "0 0 0 4px rgba(0,181,200,0.3), 0 0 20px rgba(0,181,200,0.15)";
        el.style.transform = "scale(1.01)";
        setTimeout(() => {
          el.style.boxShadow = "";
          el.style.transform = "";
        }, 2500);
      }
    },

    // ─── Focus ───
    focus(fieldId: string) {
      this.focusInput(fieldId);
    },
    focusInput(field: string) {
      const input = findInput(field);
      if (input) {
        input.focus();
        input.style.transition = "box-shadow 0.3s";
        input.style.boxShadow = "0 0 0 3px rgba(0,181,200,0.3)";
        setTimeout(() => { input.style.boxShadow = ""; }, 1500);
      }
    },

    // ─── Live Typing ───
    type(field: string, value: string) {
      if (typingIntervals.has(field)) {
        clearInterval(typingIntervals.get(field)!);
        typingIntervals.delete(field);
      }
      const input = findInput(field);
      if (!input) {
        window.dispatchEvent(new CustomEvent("booking:fill", { detail: { [field]: value } }));
        return;
      }
      input.focus();
      input.style.transition = "box-shadow 0.3s";
      input.style.boxShadow = "0 0 0 3px rgba(0,181,200,0.3)";

      let index = 0;
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype, "value"
      )?.set || Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype, "value"
      )?.set;

      if (!nativeInputValueSetter) {
        window.dispatchEvent(new CustomEvent("booking:fill", { detail: { [field]: value } }));
        return;
      }

      typingIntervals.set(field, setInterval(() => {
        index++;
        const current = value.slice(0, index);
        nativeInputValueSetter.call(input, current);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));

        if (index >= value.length) {
          clearInterval(typingIntervals.get(field)!);
          typingIntervals.delete(field);
          setTimeout(() => { input.style.boxShadow = ""; }, 500);
          window.dispatchEvent(new CustomEvent("booking:fill", { detail: { [field]: value } }));
        }
      }, 50));
    },

    // ─── Selection (for service cards, time slots, etc.) ───
    select(field: string, option: string) {
      if (field === "service") {
        const btn = document.querySelector(`[data-service-id="${option}"]`) as HTMLElement;
        btn?.click();
      }
      window.dispatchEvent(new CustomEvent("booking:fill", { detail: { [field]: option } }));
    },

    // ─── Form ───
    fillForm(fieldOrData: string | Record<string, string>, value?: string) {
      const data: Record<string, string> =
        typeof fieldOrData === "string" && value !== undefined
          ? { [fieldOrData]: value }
          : typeof fieldOrData === "object"
          ? fieldOrData
          : {};
      window.dispatchEvent(new CustomEvent("booking:fill", { detail: data }));
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    submitBooking() {
      window.dispatchEvent(new CustomEvent("booking:submit"));
    },

    // ─── Steps ───
    nextBookingStep() {
      window.dispatchEvent(new CustomEvent("booking:next"));
    },
    prevBookingStep() {
      window.dispatchEvent(new CustomEvent("booking:prev"));
    },

    // ─── External Links ───
    callClinic() {
      window.location.href = "tel:984-7857569";
    },
    openGoogleMaps() {
      window.open("https://maps.google.com/?q=Panthi+Dental+Clinic+Ghorahi", "_blank");
    },
    openFacebook() {
      window.open("https://www.facebook.com/p/Panthi-Dental-Clinic-Dang-Ghorahi-100057271586524/", "_blank");
    },
    openWhatsApp() {
      window.open("https://wa.me/9779847857569", "_blank");
    },

    // ─── Toast ───
    showToast(message: string) {
      window.dispatchEvent(new CustomEvent("toast:show", { detail: message }));
    },

    // ─── Confetti ───
    playConfetti() {
      window.dispatchEvent(new CustomEvent("confetti:play"));
    },

    // ─── Voice ───
    startVoice() {
      window.dispatchEvent(new CustomEvent("voice:start"));
    },
    stopVoice() {
      window.dispatchEvent(new CustomEvent("voice:stop"));
    },
  };
}
