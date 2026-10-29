"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { makeInitialState, type IkigaiState } from "./model";
import { deleteStoredState, readStoredState, STORAGE_KEY, writeStoredState, type StorageState } from "./storage";

export function useIkigaiState() {
  const [state, setState] = useState<IkigaiState>(makeInitialState);
  const current = useRef(state);
  const storage = useRef<Storage | null>(null);
  const blocked = useRef(true);
  const ready = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [storageState, setStorageState] = useState<StorageState>("ready");

  useEffect(() => {
    function load() {
      try {
        storage.current = window.localStorage;
        const result = readStoredState(storage.current);
        blocked.current = result.state !== "ready";
        setStorageState(result.state);
        if (result.state === "ready") {
          current.current = result.data;
          setState(result.data);
        }
      } catch {
        blocked.current = true;
        setStorageState("unavailable");
      }
    }
    load();
    ready.current = true;
    setLoaded(true);
    function sync(event: StorageEvent) {
      if (event.storageArea !== storage.current || (event.key !== STORAGE_KEY && event.key !== null)) return;
      // Read the latest stored snapshot, even if several tab events are queued.
      load();
    }
    window.addEventListener("storage", sync);
    return () => {
      ready.current = false;
      window.removeEventListener("storage", sync);
    };
  }, []);

  const change = useCallback((update: (previous: IkigaiState) => IkigaiState) => {
    if (!ready.current) return;
    const next = { ...update(current.current), savedAt: new Date().toISOString() };
    current.current = next;
    setState(next);
    if (blocked.current || !storage.current) return;
    if (!writeStoredState(storage.current, next)) {
      blocked.current = true;
      const result = readStoredState(storage.current);
      setStorageState(result.state === "corrupt" ? "corrupt" : "unavailable");
    }
  }, []);

  const reset = useCallback(() => {
    let deleted = false;
    try {
      storage.current = window.localStorage;
      deleted = deleteStoredState(storage.current);
    } catch { /* The form remains usable in memory if storage access is blocked. */ }
    const next = makeInitialState();
    current.current = next;
    setState(next);
    blocked.current = !deleted;
    setStorageState(deleted ? "ready" : "unavailable");
    return deleted;
  }, []);

  return { state, loaded, storageState, change, reset };
}
