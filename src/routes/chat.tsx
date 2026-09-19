import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { History, Languages, Mic, Plus, Paperclip, X } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { SaathiyaMark } from "@/components/saathiya/AppShell";
import { DemoBadge, ErrorState, GhostButton, GlassCard } from "@/components/saathiya/ui";
import { useSpeechInput } from "@/hooks/useSpeechInput";
import { runChat, type ChatMessage, type Language } from "@/lib/ai/service";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Saathiya AI" },
      {
        name: "description",
        content:
          "Chat with Saathiya AI in Hindi or English about studies, general health information and staying safe online.",
      },
      { property: "og:title", content: "AI Chat — Saathiya AI" },
      {
        property: "og:description",
        content: "A calm, bilingual AI chat for learning, wellbeing and cyber safety.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS: Record<Language, string[]> = {
  en: [
    "Explain Newton's third law with an everyday example",
    "Is this SMS about a KYC update safe?",
    "How much water should I drink in summer?",
    "Make a 7-day revision plan for maths",
  ],
  hi: [
    "न्यूटन का तीसरा नियम आसान उदाहरण से समझाइए",
    "क्या यह KYC वाला SMS सुरक्षित है?",
    "गर्मियों में कितना पानी पीना चाहिए?",
    "गणित के लिए 7 दिन की रिवीज़न योजना बनाइए",
  ],
};

interface Thread {
  id: string;
  title: string;
  messages: ChatMessage[];
}

const DEMO_HISTORY: Thread[] = [
  { id: "demo-1", title: "Demo · Photosynthesis explained", messages: [] },
  { id: "demo-2", title: "Demo · Is this refund SMS a scam?", messages: [] },
  { id: "demo-3", title: "Demo · Sleep routine basics", messages: [] },
];

const TEXT_TYPES = /\.(txt|md|csv|json|log)$/i;

interface Attachment {
  name: string;
  text: string | null;
}

function ChatPage() {
  const [language, setLanguage] = useState<Language>("en");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<"ready" | "submitted" | "error">("ready");
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const speech = useSpeechInput(language);

  // Put the recognised speech into the message box as it is heard.
  useEffect(() => {
    if (!speech.transcript) return;
    const textarea = formRef.current?.querySelector("textarea");
    if (!textarea) return;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )?.set;
    setter?.call(textarea, speech.transcript);
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  }, [speech.transcript]);

  const send = useCallback(
    async (text: string, file?: Attachment | null) => {
      const trimmed = text.trim();
      if (!trimmed || status === "submitted") return;
      setLastPrompt(trimmed);
      setError(null);
      const history = [...messages, { role: "user" as const, content: trimmed }];
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "user",
          content: trimmed,
          createdAt: Date.now(),
          ...(file ? { attachmentName: file.name } : {}),
        },
      ]);
      setAttachment(null);
      setStatus("submitted");
      try {
        const res = await runChat({
          language,
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          attachment: file ?? null,
        });
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: res.text || "I could not put that into words. Please ask me again.",
            createdAt: Date.now(),
            isDemo: res.isDemo,
          },
        ]);
        setStatus("ready");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Saathiya could not reply just now.");
        setStatus("error");
      }
    },
    [language, messages, status],
  );

  async function pickFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    let text: string | null = null;
    if (TEXT_TYPES.test(file.name) || file.type.startsWith("text/")) {
      try {
        text = (await file.text()).slice(0, 18000);
      } catch {
        text = null;
      }
    }
    setAttachment({ name: file.name, text });
  }

  function newConversation() {
    setMessages([]);
    setError(null);
    setStatus("ready");
    setAttachment(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className={cn("space-y-3", showHistory ? "block" : "hidden lg:block")}>
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Chat history</h2>
            <DemoBadge />
          </div>
          <ul className="space-y-2">
            {DEMO_HISTORY.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={newConversation}
                  className="w-full rounded-xl border border-border px-3 py-3 text-left text-xs text-muted-foreground transition-colors hover:bg-secondary"
                >
                  {thread.title}
                </button>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground">
            Real history needs a connected backend; these entries are placeholders.
          </p>
        </GlassCard>
      </aside>

      <section className="space-y-4">
        <div className="glass grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <SaathiyaMark />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Saathiya AI Chat</p>
              <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
                Learning · Health info · Cyber safety
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <label className="sr-only" htmlFor="lang">
              Language
            </label>
            <div className="flex items-center gap-1 rounded-xl border border-border p-1">
              <Languages className="ml-1 size-4 text-primary" aria-hidden />
              {(["en", "hi"] as Language[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLanguage(code)}
                  aria-pressed={language === code}
                  className={cn(
                    "min-h-9 rounded-lg px-2.5 text-xs font-semibold transition-colors",
                    language === code
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary",
                  )}
                >
                  {code === "en" ? "EN" : "हिं"}
                </button>
              ))}
            </div>
            <GhostButton
              onClick={() => setShowHistory((v) => !v)}
              className="lg:hidden"
              aria-label="Toggle chat history"
            >
              <History className="size-4" aria-hidden />
            </GhostButton>
            <GhostButton onClick={newConversation} aria-label="New conversation">
              <Plus className="size-4" aria-hidden />
            </GhostButton>
          </div>
        </div>

        <div className="glass flex h-[62vh] min-h-[420px] flex-col overflow-hidden rounded-2xl">
          <Conversation className="flex-1">
            <ConversationContent className="gap-4">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<SaathiyaMark className="size-11" />}
                  title="Namaste! How can I help?"
                  description="Ask about a school topic, a suspicious message, or general health information. Answers are educational, never a diagnosis."
                />
              ) : (
                messages.map((m) => (
                  <Message key={m.id} from={m.role}>
                    <MessageContent
                      className={cn(
                        m.role === "assistant" && "bg-transparent p-0 text-foreground",
                      )}
                    >
                      {m.attachmentName ? (
                        <p className="mb-1 text-[11px] opacity-80">📎 {m.attachmentName}</p>
                      ) : null}
                      <MessageResponse>{m.content}</MessageResponse>
                      {m.isDemo ? <DemoBadge className="mt-2 self-start" /> : null}
                    </MessageContent>
                  </Message>
                ))
              )}
              {status === "submitted" ? (
                <Shimmer className="text-sm">Saathiya is thinking</Shimmer>
              ) : null}
              {error ? <ErrorState message={error} onRetry={() => send(lastPrompt)} /> : null}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3" ref={formRef}>
            {messages.length === 0 ? (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SUGGESTIONS[language].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="min-h-10 shrink-0 rounded-xl border border-border px-3 text-xs text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : null}

            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.json,.log,.pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                void pickFile(e.target.files);
                e.target.value = "";
              }}
            />

            {attachment ? (
              <p className="mb-2 flex items-center gap-2 text-xs text-accent">
                📎 {attachment.name}
                {attachment.text
                  ? " — its text will be sent with your message"
                  : " — text could not be read here, so mention what to look for"}
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  aria-label="Remove attachment"
                  className="rounded-full p-1 hover:bg-secondary"
                >
                  <X className="size-3" aria-hidden />
                </button>
              </p>
            ) : null}
            {speech.listening ? (
              <p className="mb-2 flex items-center gap-2 text-xs text-primary">
                <span className="size-2 animate-pulse rounded-full bg-primary" aria-hidden />
                Listening{language === "hi" ? " (हिंदी)" : " (English)"} — speak now.
              </p>
            ) : null}
            {speech.error ? (
              <p className="mb-2 text-xs text-destructive">{speech.error}</p>
            ) : null}

            <PromptInput
              onSubmit={(message) => {
                speech.stop();
                void send(message.text, attachment);
              }}
            >
              <PromptInputTextarea
                placeholder={
                  language === "hi" ? "अपना सवाल लिखिए…" : "Ask Saathiya anything…"
                }
              />
              <PromptInputFooter>
                <PromptInputTools>
                  <PromptInputButton
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Attach a file"
                  >
                    <Paperclip className="size-4" aria-hidden />
                  </PromptInputButton>
                  <PromptInputButton
                    onClick={() => (speech.listening ? speech.stop() : speech.start())}
                    aria-label={speech.listening ? "Stop voice input" : "Start voice input"}
                    className={speech.listening ? "text-primary" : undefined}
                  >
                    <Mic className="size-4" aria-hidden />
                  </PromptInputButton>
                </PromptInputTools>
                <PromptInputSubmit status={status === "submitted" ? "submitted" : "ready"} />
              </PromptInputFooter>
            </PromptInput>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Saathiya gives educational information only. For medical, legal or financial decisions,
              consult a qualified professional.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
