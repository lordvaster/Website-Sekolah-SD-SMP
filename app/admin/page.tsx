// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"password" | "twoFactor">("password");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal masuk.");
        return;
      }
      if (data.twoFactorRequired) {
        setStep("twoFactor");
        return;
      }
      router.push("/admin/pengaturan");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const onSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Gagal masuk.");
        return;
      }
      router.push("/admin/pengaturan");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-page flex min-h-[60vh] items-center justify-center py-14">
      {step === "password" ? (
        <form onSubmit={onSubmitPassword} className="card w-full max-w-sm p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-primary-light">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-center font-heading text-xl font-bold text-ink dark:text-ink-dark">
            Login Admin
          </h1>
          <p className="mt-1 text-center text-sm text-ink/60 dark:text-ink-dark/60">
            Khusus untuk pengelola website sekolah.
          </p>

          <div className="mt-6">
            <label htmlFor="username" className="block text-sm font-semibold text-ink dark:text-ink-dark">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-semibold text-ink dark:text-ink-dark">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm font-semibold text-cta">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            Masuk
          </button>
        </form>
      ) : (
        <form onSubmit={onSubmitCode} className="card w-full max-w-sm p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary dark:text-primary-light">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-center font-heading text-xl font-bold text-ink dark:text-ink-dark">
            Verifikasi Dua Langkah
          </h1>
          <p className="mt-1 text-center text-sm text-ink/60 dark:text-ink-dark/60">
            Masukkan kode 6 digit dari aplikasi authenticator anda.
          </p>

          <div className="mt-6">
            <label htmlFor="code" className="block text-sm font-semibold text-ink dark:text-ink-dark">
              Kode Verifikasi
            </label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              required
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 text-center text-lg tracking-[0.5em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 text-sm font-semibold text-cta">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-70">
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            Verifikasi
          </button>

          <button
            type="button"
            onClick={() => {
              setStep("password");
              setCode("");
              setError("");
            }}
            className="mt-3 w-full text-center text-sm font-semibold text-primary hover:underline dark:text-primary-light"
          >
            Kembali ke halaman password
          </button>
        </form>
      )}
    </div>
  );
}
