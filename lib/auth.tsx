"use client";

/**
 * Front-end authentication layer.
 *
 * Accounts and sessions live in the browser (localStorage / sessionStorage) so the
 * template works with no backend. Passwords are salted and hashed with PBKDF2 via the
 * Web Crypto API, never stored in plain text. For production, replace the functions in
 * this file with calls to a real auth service (the exported API stays the same).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "student" | "graduate" | "trainee" | "pupil";
export type User = { id: string; name: string; email: string; role: Role; createdAt: number };
type StoredUser = User & { salt: string; hash: string };
type Result = { ok: true } | { ok: false; error: string };

const USERS_KEY = "mono:users";
const SESSION_KEY = "mono:session";
const ATTEMPTS_KEY = "mono:attempts";
const RESET_KEY = "mono:resets";
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30_000;
const SESSION_MS = 1000 * 60 * 60 * 24 * 14;

const read = <T,>(store: Storage, key: string, fallback: T): T => {
  try { const v = store.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
};
const write = (store: Storage, key: string, value: unknown) => {
  try { store.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
};

const bytesToB64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b)));
async function hashPassword(password: string, saltB64?: string) {
  const salt = saltB64 ? Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0)) : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 150_000 }, key, 256);
  return { salt: bytesToB64(salt), hash: bytesToB64(bits) };
}

export function passwordIssues(pw: string): string[] {
  const out: string[] = [];
  if (pw.length < 8) out.push("At least 8 characters");
  if (!/[A-Z]/.test(pw)) out.push("One uppercase letter");
  if (!/[a-z]/.test(pw)) out.push("One lowercase letter");
  if (!/[0-9]/.test(pw)) out.push("One number");
  return out;
}
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const strip = ({ salt: _s, hash: _h, ...u }: StoredUser): User => u;

type AuthCtx = {
  user: User | null;
  ready: boolean;
  signUp: (d: { name: string; email: string; password: string; role: Role }) => Promise<Result>;
  logIn: (email: string, password: string, remember: boolean) => Promise<Result>;
  logOut: () => void;
  requestReset: (email: string) => Result & { code?: string };
  resetPassword: (email: string, code: string, password: string) => Promise<Result>;
  updateProfile: (d: { name: string; role: Role }) => Result;
  changePassword: (current: string, next: string) => Promise<Result>;
  deleteAccount: (password: string) => Promise<Result>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const loadSession = useCallback(() => {
    const s = read<{ userId: string; expires: number } | null>(localStorage, SESSION_KEY, null)
      ?? read<{ userId: string; expires: number } | null>(sessionStorage, SESSION_KEY, null);
    if (!s || s.expires < Date.now()) return null;
    const found = read<StoredUser[]>(localStorage, USERS_KEY, []).find((u) => u.id === s.userId);
    return found ? strip(found) : null;
  }, []);

  useEffect(() => {
    setUser(loadSession());
    setReady(true);
    const onStorage = (e: StorageEvent) => { if (e.key === SESSION_KEY || e.key === USERS_KEY) setUser(loadSession()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [loadSession]);

  const startSession = (u: StoredUser, remember: boolean) => {
    localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY);
    write(remember ? localStorage : sessionStorage, SESSION_KEY, { userId: u.id, expires: Date.now() + SESSION_MS });
    setUser(strip(u));
  };
  const users = () => read<StoredUser[]>(localStorage, USERS_KEY, []);

  const value = useMemo<AuthCtx>(() => ({
    user, ready,

    async signUp({ name, email, password, role }) {
      email = email.trim().toLowerCase(); name = name.trim();
      if (name.length < 2) return { ok: false, error: "Please enter your full name." };
      if (!isEmail(email)) return { ok: false, error: "Enter a valid email address." };
      if (passwordIssues(password).length) return { ok: false, error: "Password does not meet the requirements." };
      const all = users();
      if (all.some((u) => u.email === email)) return { ok: false, error: "An account with this email already exists." };
      const { salt, hash } = await hashPassword(password);
      const created: StoredUser = { id: crypto.randomUUID(), name, email, role, createdAt: Date.now(), salt, hash };
      write(localStorage, USERS_KEY, [...all, created]);
      startSession(created, true);
      return { ok: true };
    },

    async logIn(email, password, remember) {
      email = email.trim().toLowerCase();
      const attempts = read<Record<string, { count: number; until: number }>>(localStorage, ATTEMPTS_KEY, {});
      const a = attempts[email];
      if (a && a.until > Date.now()) return { ok: false, error: `Too many attempts. Try again in ${Math.ceil((a.until - Date.now()) / 1000)}s.` };
      const found = users().find((u) => u.email === email);
      const fail = () => {
        const next = { count: (a && a.until === 0 ? a.count : 0) + 1, until: 0 };
        if (next.count >= MAX_ATTEMPTS) { next.count = 0; next.until = Date.now() + LOCK_MS; }
        write(localStorage, ATTEMPTS_KEY, { ...attempts, [email]: next });
        return { ok: false as const, error: "Incorrect email or password." };
      };
      if (!found) return fail();
      const { hash } = await hashPassword(password, found.salt);
      if (hash !== found.hash) return fail();
      const { [email]: _drop, ...rest } = attempts;
      write(localStorage, ATTEMPTS_KEY, rest);
      startSession(found, remember);
      return { ok: true };
    },

    logOut() {
      localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); setUser(null);
    },

    requestReset(email) {
      email = email.trim().toLowerCase();
      if (!isEmail(email)) return { ok: false, error: "Enter a valid email address." };
      // Same response whether or not the account exists, so emails can't be probed.
      if (users().some((u) => u.email === email)) {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        const resets = read<Record<string, { code: string; expires: number }>>(localStorage, RESET_KEY, {});
        write(localStorage, RESET_KEY, { ...resets, [email]: { code, expires: Date.now() + 10 * 60_000 } });
        return { ok: true, code };
      }
      return { ok: true };
    },

    async resetPassword(email, code, password) {
      email = email.trim().toLowerCase();
      if (passwordIssues(password).length) return { ok: false, error: "Password does not meet the requirements." };
      const resets = read<Record<string, { code: string; expires: number }>>(localStorage, RESET_KEY, {});
      const r = resets[email];
      if (!r || r.code !== code.trim() || r.expires < Date.now()) return { ok: false, error: "That code is invalid or has expired." };
      const all = users();
      const idx = all.findIndex((u) => u.email === email);
      if (idx < 0) return { ok: false, error: "That code is invalid or has expired." };
      all[idx] = { ...all[idx], ...(await hashPassword(password)) };
      write(localStorage, USERS_KEY, all);
      const { [email]: _d, ...rest } = resets;
      write(localStorage, RESET_KEY, rest);
      return { ok: true };
    },

    updateProfile({ name, role }) {
      if (!user) return { ok: false, error: "Not signed in." };
      if (name.trim().length < 2) return { ok: false, error: "Please enter your full name." };
      const all = users().map((u) => (u.id === user.id ? { ...u, name: name.trim(), role } : u));
      write(localStorage, USERS_KEY, all);
      setUser({ ...user, name: name.trim(), role });
      return { ok: true };
    },

    async changePassword(current, next) {
      if (!user) return { ok: false, error: "Not signed in." };
      if (passwordIssues(next).length) return { ok: false, error: "New password does not meet the requirements." };
      const all = users();
      const idx = all.findIndex((u) => u.id === user.id);
      if (idx < 0) return { ok: false, error: "Account not found." };
      if ((await hashPassword(current, all[idx].salt)).hash !== all[idx].hash) return { ok: false, error: "Current password is incorrect." };
      all[idx] = { ...all[idx], ...(await hashPassword(next)) };
      write(localStorage, USERS_KEY, all);
      return { ok: true };
    },

    async deleteAccount(password) {
      if (!user) return { ok: false, error: "Not signed in." };
      const all = users();
      const me = all.find((u) => u.id === user.id);
      if (!me || (await hashPassword(password, me.salt)).hash !== me.hash) return { ok: false, error: "Password is incorrect." };
      write(localStorage, USERS_KEY, all.filter((u) => u.id !== user.id));
      Object.keys(localStorage).filter((k) => k.startsWith(`mono:data:${user.id}:`)).forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); setUser(null);
      return { ok: true };
    },
  }), [user, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used inside <AuthProvider>");
  return c;
}

/** Per-user persisted state, e.g. useUserData("enrollments", {}) */
export function useUserData<T>(key: string, initial: T) {
  const { user } = useAuth();
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  const storageKey = user ? `mono:data:${user.id}:${key}` : null;

  useEffect(() => {
    setLoaded(false);
    if (storageKey) setValue(read<T>(localStorage, storageKey, initial)); else setValue(initial);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const update = useCallback((next: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      if (storageKey) write(localStorage, storageKey, v);
      return v;
    });
  }, [storageKey]);

  return [value, update, loaded] as const;
}
