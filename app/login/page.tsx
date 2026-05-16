"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firmName, setFirmName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      if (!supabase) {
        localStorage.setItem("taxflow_local_user", JSON.stringify({ email, firmName: firmName || "My CA Firm", mode }));
        window.location.href = "/";
        return;
      }
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { firm_name: firmName || "My CA Firm" } } });
        if (error) throw error;
        setMessage("Account created. You can sign in now.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        window.location.href = "/";
      }
    } catch {
      setMessage("Could not complete login. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function googleLogin() {
    setMessage("");
    if (!supabase) {
      localStorage.setItem("taxflow_local_user", JSON.stringify({ email: "google-user", firmName: "My CA Firm", mode: "google" }));
      window.location.href = "/";
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/` } });
    if (error) setMessage("Google sign in is not available yet. Please use email sign in.");
  }

  return <main className="min-h-screen bg-slate-950 px-4 py-10 text-white"><section className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_420px] md:items-center"><div><p className="w-fit rounded-full bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-200">TaxFlow</p><h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Run your CA/GST firm from one control room.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">Track clients, GST work, documents, staff tasks, WhatsApp reminders and fees without spreadsheet chaos.</p><div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-2"><div className="rounded-2xl bg-white/10 p-4">Client CRM</div><div className="rounded-2xl bg-white/10 p-4">GST workflow</div><div className="rounded-2xl bg-white/10 p-4">Staff tasks</div><div className="rounded-2xl bg-white/10 p-4">WhatsApp reminders</div></div></div><form onSubmit={submit} className="rounded-3xl bg-white p-6 text-slate-950 shadow-2xl"><h2 className="text-2xl font-black">{mode === "signup" ? "Create account" : "Sign in"}</h2><p className="mt-2 text-sm text-slate-500">Use Google or email to continue to TaxFlow.</p><button type="button" onClick={googleLogin} className="mt-5 w-full rounded-2xl border bg-white px-4 py-3 font-black text-slate-900">Continue with Google</button><div className="my-5 flex items-center gap-3 text-xs font-bold uppercase text-slate-400"><span className="h-px flex-1 bg-slate-200"/>or<span className="h-px flex-1 bg-slate-200"/></div>{mode === "signup" && <input className="w-full rounded-2xl border px-4 py-3" placeholder="Firm name" value={firmName} onChange={(event) => setFirmName(event.target.value)} />}<input className="mt-3 w-full rounded-2xl border px-4 py-3" placeholder="Email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /><input className="mt-3 w-full rounded-2xl border px-4 py-3" placeholder="Password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /><button disabled={loading} className="mt-5 w-full rounded-2xl bg-blue-600 px-4 py-3 font-black text-white disabled:opacity-60">{loading ? "Please wait..." : mode === "signup" ? "Create account" : "Sign in"}</button>{message && <p className="mt-4 rounded-2xl bg-slate-100 p-3 text-sm font-bold text-slate-700">{message}</p>}<button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="mt-4 text-sm font-bold text-blue-700">{mode === "signup" ? "Already have an account? Sign in" : "Need an account? Sign up"}</button><a href="/" className="mt-4 block text-sm font-bold text-slate-500">Continue without signing in</a></form></section></main>;
}
