import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: unknown) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const ctor = w["SpeechRecognition"] ?? w["webkitSpeechRecognition"];
  return (ctor as (new () => SpeechRecognitionLike) | undefined) ?? null;
}

/** Real browser speech-to-text (Web Speech API) with Hindi/English locales. */
export function useSpeechInput(language: "en" | "hi") {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError("Voice input is not supported in this browser. Chrome on Android works best.");
      return;
    }
    setError(null);
    setTranscript("");
    const recognition = new Ctor();
    recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event: unknown) => {
      const results = (event as { results: ArrayLike<ArrayLike<{ transcript: string }>> }).results;
      let text = "";
      for (let i = 0; i < results.length; i += 1) {
        text += results[i]?.[0]?.transcript ?? "";
      }
      setTranscript(text.trim());
    };
    recognition.onerror = (event: unknown) => {
      const code = (event as { error?: string }).error;
      setError(
        code === "not-allowed"
          ? "Microphone permission was blocked. Allow it in your browser settings."
          : "Could not hear you clearly. Please try again.",
      );
      setListening(false);
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [language]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return { supported, listening, transcript, error, start, stop, setTranscript };
}
