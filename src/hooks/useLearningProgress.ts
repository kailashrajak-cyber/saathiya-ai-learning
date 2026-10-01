import { useCallback, useEffect, useState } from "react";
import { MODULES } from "@/lib/learn/course";

type Entry = { lessonAt?: string; quizScore?: number; quizTotal?: number; quizAt?: string };
type State = { modules: Record<string, Entry>; days: string[] };

const KEY = "saathiya-learning-progress-v1";
const EMPTY: State = { modules: {}, days: [] };

const today = () => new Date().toLocaleDateString("en-CA");

function read(): State {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function streakOf(days: string[]) {
  const set = new Set(days);
  const d = new Date();
  if (!set.has(d.toLocaleDateString("en-CA"))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(d.toLocaleDateString("en-CA"))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function useLearningProgress() {
  const [state, setState] = useState<State>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setState(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((id: string, patch: Entry) => {
    const cur = read();
    const days = cur.days.includes(today()) ? cur.days : [...cur.days, today()];
    const next = { days, modules: { ...cur.modules, [id]: { ...cur.modules[id], ...patch } } };
    localStorage.setItem(KEY, JSON.stringify(next));
    setState(next);
  }, []);

  const completeLesson = (id: string) => update(id, { lessonAt: new Date().toISOString() });
  const saveQuiz = (id: string, score: number, total: number) =>
    update(id, { quizScore: score, quizTotal: total, quizAt: new Date().toISOString() });
  const reset = () => {
    localStorage.removeItem(KEY);
    setState(EMPTY);
  };

  const lessonsDone = MODULES.filter((m) => state.modules[m.id]?.lessonAt).length;
  const quizzesDone = MODULES.filter((m) => state.modules[m.id]?.quizAt).length;
  const projectDone = state.modules["beginner-project"]?.lessonAt ? 1 : 0;
  const next = MODULES.find((m) => !state.modules[m.id]?.lessonAt) ?? null;
  const percent = Math.round((lessonsDone / MODULES.length) * 100);
  const hasActivity = lessonsDone + quizzesDone > 0;
  const activeToday = state.days.includes(today());
  // Roadmap stage: 0 = Beginner, 1 = Fundamentals (in progress or done). Later stages unlock with future courses.
  const stageIndex = lessonsDone === 0 ? 0 : 1;
  const courseComplete = lessonsDone === MODULES.length;

  return {
    ready,
    modules: state.modules,
    lessonsDone,
    quizzesDone,
    projectDone,
    next,
    percent,
    hasActivity,
    activeToday,
    streak: streakOf(state.days),
    stageIndex,
    courseComplete,
    completeLesson,
    saveQuiz,
    reset,
  };
}
