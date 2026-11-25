"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("Beshoy1959@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <Link className="logo" href="/">VOLT<span>.</span></Link>
      <form className="login-card" onSubmit={handleSubmit}>
        <span className="eyebrow">VOLT / SECURE ACCESS</span>
        <h1>Welcome <em>back.</em></h1>
        <p>Sign in with your VOLT administrator account to manage the store.</p>
        <label>Email address<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="button dark" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in to admin"}</button>
        <small>Administrator access only. If you have not set a password yet, use the password recovery flow in Supabase Authentication.</small>
      </form>
    </main>
  );
}
