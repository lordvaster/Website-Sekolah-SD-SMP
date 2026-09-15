// Author: Zeday | https://join.co.id
"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck, ShieldOff } from "lucide-react";

type Status = "loading" | "disabled" | "enabled";

export default function TwoFactorSettings() {
  const [status, setStatus] = useState<Status>("loading");
  const [mode, setMode] = useState<"view" | "setup" | "disable">("view");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/2fa/status")
      .then((res) => res.json())
      .then((data) => setStatus(data.enabled ? "enabled" : "disabled"))
      .catch(() => setStatus("disabled"));
  }, []);

  const startSetup = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa/setup", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Gagal memulai setup 2FA.");
        return;
      }
      setQrDataUrl(data.qrDataUrl);
      setSecret(data.secret);
      setMode("setup");
    } finally {
      setBusy(false);
    }
  };

  const confirmSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Kode salah.");
        return;
      }
      setStatus("enabled");
      setMode("view");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  const confirmDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Kode salah.");
        return;
      }
      setStatus("disabled");
      setMode("view");
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="font-heading text-lg font-bold text-ink dark:text-ink-dark">
        Verifikasi Dua Langkah (2FA) - Akun Saya
      </h2>
      <p className="mt-1 text-sm text-ink/60 dark:text-ink-dark/60">
        Tambahan keamanan khusus akun anda sendiri, di luar password - login butuh
        kode 6 digit dari aplikasi authenticator (Google Authenticator, Authy, 1Password, dll).
      </p>

      {status === "loading" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-ink/60 dark:text-ink-dark/60">
          <Loader2 className="h-4 w-4 animate-spin" /> Memuat status...
        </p>
      )}

      {status !== "loading" && mode === "view" && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-black/10 p-4 dark:border-white/15">
          <span
            className={`flex items-center gap-2 text-sm font-semibold ${
              status === "enabled"
                ? "text-secondary-dark dark:text-secondary-light"
                : "text-ink/70 dark:text-ink-dark/70"
            }`}
          >
            {status === "enabled" ? (
              <ShieldCheck className="h-5 w-5" />
            ) : (
              <ShieldOff className="h-5 w-5" />
            )}
            {status === "enabled" ? "Aktif" : "Belum aktif"}
          </span>
          <button
            type="button"
            onClick={() => (status === "enabled" ? setMode("disable") : startSetup())}
            disabled={busy}
            className={status === "enabled" ? "btn-secondary disabled:opacity-70" : "btn-primary disabled:opacity-70"}
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "enabled" ? "Nonaktifkan" : "Aktifkan 2FA"}
          </button>
        </div>
      )}

      {mode === "setup" && (
        <form onSubmit={confirmSetup} className="mt-4 space-y-4 rounded-lg border border-black/10 p-4 dark:border-white/15">
          <p className="text-sm text-ink/80 dark:text-ink-dark/80">
            1. Scan QR code ini dengan aplikasi authenticator anda.
          </p>
          {qrDataUrl && (
            // Data URI hasil generate di server (bukan aset statis) - tidak
            // relevan dioptimasi lewat next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="QR code setup 2FA"
              width={180}
              height={180}
              className="rounded-lg border border-black/10 dark:border-white/15"
            />
          )}
          <p className="text-xs text-ink/50 dark:text-ink-dark/50">
            Tidak bisa scan? Masukkan kode ini manual: <code className="font-mono">{secret}</code>
          </p>

          <label htmlFor="setup-code" className="block text-sm text-ink/80 dark:text-ink-dark/80">
            2. Masukkan kode 6 digit yang muncul di aplikasi untuk konfirmasi.
          </label>
          <input
            id="setup-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full max-w-[160px] rounded-lg border border-black/10 px-4 py-2.5 text-center text-lg tracking-[0.5em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />

          {error && (
            <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-70">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Konfirmasi & Aktifkan
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("view");
                setCode("");
                setError("");
              }}
              className="text-sm font-semibold text-ink/60 hover:underline dark:text-ink-dark/60"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {mode === "disable" && (
        <form onSubmit={confirmDisable} className="mt-4 space-y-4 rounded-lg border border-black/10 p-4 dark:border-white/15">
          <label htmlFor="disable-code" className="block text-sm text-ink/80 dark:text-ink-dark/80">
            Masukkan kode 6 digit dari aplikasi authenticator anda untuk menonaktifkan 2FA.
          </label>
          <input
            id="disable-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full max-w-[160px] rounded-lg border border-black/10 px-4 py-2.5 text-center text-lg tracking-[0.5em] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />

          {error && (
            <p role="alert" className="flex items-center gap-2 text-sm font-semibold text-cta">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="btn-secondary disabled:opacity-70">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              Nonaktifkan
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("view");
                setCode("");
                setError("");
              }}
              className="text-sm font-semibold text-ink/60 hover:underline dark:text-ink-dark/60"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {status === "enabled" && mode === "view" && (
        <p className="mt-3 flex items-center gap-1 text-xs text-ink/50 dark:text-ink-dark/50">
          <CheckCircle2 className="h-3.5 w-3.5" /> Kehilangan akses ke aplikasi authenticator? Hubungi
          pengelola server untuk pemulihan lewat akses server langsung.
        </p>
      )}
    </div>
  );
}
