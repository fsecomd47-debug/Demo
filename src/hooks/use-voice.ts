"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type VoiceStatus = "idle" | "listening" | "processing" | "speaking";

export function useVoice() {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interruptRef = useRef(false);
  const tokenRef = useRef<string | null>(null);
  const mutedRef = useRef(false);

  const listenResolve = useRef<((v: string | null) => void) | null>(null);
  const speakResolve = useRef<(() => void) | null>(null);

  const isSupported =
    typeof window !== "undefined" &&
    (!!(window as any).SpeechRecognition ||
      !!(window as any).webkitSpeechRecognition);

  const getToken = useCallback(async () => {
    if (tokenRef.current) return tokenRef.current;
    try {
      const res = await fetch("/api/token", { method: "POST" });
      if (!res.ok) return null;
      const { token } = await res.json();
      if (token) tokenRef.current = token;
      return token;
    } catch {
      return null;
    }
  }, []);

  const startListening = useCallback(async (): Promise<string | null> => {
    if (mutedRef.current) return null;
    interruptRef.current = false;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (speakResolve.current) {
      speakResolve.current();
      speakResolve.current = null;
    }

    return new Promise<string | null>((resolve) => {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        resolve(null);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognitionRef.current = recognition;
      listenResolve.current = resolve;

      let settled = false;

      const settle = (value: string | null) => {
        if (settled) return;
        settled = true;
        recognitionRef.current = null;
        listenResolve.current = null;
        setStatus(value ? "processing" : "idle");
        resolve(value);
      };

      recognition.onresult = (e: any) => {
        const t = e.results[0]?.[0]?.transcript?.trim();
        if (t && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          audioRef.current = null;
        }
        if (t && speakResolve.current) {
          speakResolve.current();
          speakResolve.current = null;
        }
        settle(t || null);
      };

      recognition.onerror = () => settle(null);
      recognition.onend = () => {
        if (!settled) settle(null);
      };

      setStatus("listening");
      try {
        recognition.start();
      } catch {
        settle(null);
      }
    });
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (listenResolve.current) {
      listenResolve.current(null);
      listenResolve.current = null;
    }
  }, []);

  const speakText = useCallback(
    async (text: string): Promise<void> => {
      if (interruptRef.current) return;

      return new Promise<void>(async (resolve) => {
        try {
          const token = await getToken();
          if (!token) {
            resolve();
            return;
          }

          if (interruptRef.current) {
            resolve();
            return;
          }

          setStatus("speaking");
          speakResolve.current = resolve;

          const Cartesia = (await import("@cartesia/cartesia-js")).default;
          const client = new Cartesia({ token });

          const response = await client.tts.generate({
            model_id: "sonic-3.5",
            transcript: text,
            voice: {
              mode: "id",
              id: "db6b0ed5-d5d3-463d-ae85-518a07d3c2b4",
            },
            output_format: {
              container: "wav",
              encoding: "pcm_s16le",
              sample_rate: 44100,
            },
          });

          if (interruptRef.current) {
            setStatus("idle");
            resolve();
            return;
          }

          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;

          audio.onended = () => {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            speakResolve.current = null;
            setStatus("idle");
            resolve();
          };

          audio.onerror = () => {
            URL.revokeObjectURL(url);
            audioRef.current = null;
            speakResolve.current = null;
            setStatus("idle");
            resolve();
          };

          await audio.play();
        } catch (err) {
          console.error("TTS error:", err);
          setStatus("idle");
          speakResolve.current = null;
          resolve();
        }
      });
    },
    [getToken]
  );

  const speakWithBargeIn = useCallback(
    async (text: string): Promise<string | null> => {
      const listenPromise = startListening();
      await speakText(text);
      stopListening();
      return await listenPromise;
    },
    [startListening, speakText, stopListening]
  );

  const interrupt = useCallback(() => {
    interruptRef.current = true;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (speakResolve.current) {
      speakResolve.current();
      speakResolve.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (listenResolve.current) {
      listenResolve.current(null);
      listenResolve.current = null;
    }

    setStatus("idle");
  }, []);

  const setMuted = useCallback(
    (muted: boolean) => {
      mutedRef.current = muted;
      setIsMuted(muted);
      if (muted) {
        if (recognitionRef.current) {
          try { recognitionRef.current.abort(); } catch {}
          recognitionRef.current = null;
        }
        if (listenResolve.current) {
          listenResolve.current(null);
          listenResolve.current = null;
        }
      }
    },
    []
  );

  const cleanup = useCallback(() => {
    interrupt();
  }, [interrupt]);

  const isMutedSync = useCallback(() => mutedRef.current, []);

  useEffect(() => {
    getToken();
  }, [getToken]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return {
    status,
    error,
    isSupported,
    isMuted,
    isListening: status === "listening",
    isSpeaking: status === "speaking",
    isProcessing: status === "processing",
    isIdle: status === "idle",
    isMutedSync,
    startListening,
    stopListening,
    speakText,
    speakWithBargeIn,
    interrupt,
    cleanup,
    setMuted,
    getToken,
  };
}
