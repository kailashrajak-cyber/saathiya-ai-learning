import { useCallback, useEffect, useState } from "react";

const KEY = "saathiya-practice-progress-v1";
type State = Record<string, string>; // categoryId -> completedAt ISO

function read(): State {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}") as State;
  } catch {
    return {};
  }
}

export function usePracticeProgress() {
  const [done, setDone] = useState<State>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDone(read());
    setReady(true);
  }, []);

  const markDone = useCallback((id: string) => {
    const next = { ...read(), [id]: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(next));
    setDone(next);
  }, []);

  return { ready, done, markDone, count: Object.keys(done).length };
}
