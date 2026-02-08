import { useState, useEffect, useCallback } from 'react';

const ONLINE_KEY = 'forum_online_users';
const HEARTBEAT_INTERVAL = 5000;
const TIMEOUT = 15000;

interface OnlineEntry {
  username: string;
  lastSeen: number;
}

const getUserId = (): string => {
  let id = sessionStorage.getItem('forum_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('forum_session_id', id);
  }
  return id;
};

export const useOnlineUsers = (username: string | null) => {
  const [count, setCount] = useState(0);

  const heartbeat = useCallback(() => {
    if (!username) return;
    const now = Date.now();
    const id = getUserId();
    const raw = localStorage.getItem(ONLINE_KEY);
    const entries: Record<string, OnlineEntry> = raw ? JSON.parse(raw) : {};

    // Update self
    entries[id] = { username, lastSeen: now };

    // Prune stale
    for (const key of Object.keys(entries)) {
      if (now - entries[key].lastSeen > TIMEOUT) {
        delete entries[key];
      }
    }

    localStorage.setItem(ONLINE_KEY, JSON.stringify(entries));
    setCount(Object.keys(entries).length);
  }, [username]);

  useEffect(() => {
    if (!username) return;

    heartbeat();
    const interval = setInterval(heartbeat, HEARTBEAT_INTERVAL);

    const onStorage = (e: StorageEvent) => {
      if (e.key === ONLINE_KEY) {
        const raw = e.newValue;
        const entries: Record<string, OnlineEntry> = raw ? JSON.parse(raw) : {};
        setCount(Object.keys(entries).length);
      }
    };
    window.addEventListener('storage', onStorage);

    const cleanup = () => {
      const id = getUserId();
      const raw = localStorage.getItem(ONLINE_KEY);
      const entries: Record<string, OnlineEntry> = raw ? JSON.parse(raw) : {};
      delete entries[id];
      localStorage.setItem(ONLINE_KEY, JSON.stringify(entries));
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [username, heartbeat]);

  return count;
};
