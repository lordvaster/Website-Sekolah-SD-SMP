// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Key, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { AdminRole, AdminUserSummary } from "@/lib/repositories/admin-users";

const roleLabels: Record<AdminRole, string> = { owner: "Owner", editor: "Editor" };

async function parseError(res: Response) {
  const data = await res.json().catch(() => ({}));
  return data.error || "Terjadi kesalahan.";
}

export default function UsersManager({
  users,
  currentUserId,
}: {
  users: AdminUserSummary[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [resettingId, setResettingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-ink dark:text-ink-dark">
          Akun Pengelola Situs
        </h2>
        <button
          type="button"
          onClick={() => {
            setShowCreate((v) => !v);
            setError("");
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Tambah Pengguna
        </button>
      </div>

      {showCreate && (
        <CreateUserForm
          busy={busy}
          setBusy={setBusy}
          error={error}
          setError={setError}
          onDone={() => {
            setShowCreate(false);
            router.refresh();
          }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="mt-6 overflow-x-auto rounded-xl2 bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/5 dark:ring-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/50 dark:border-white/10 dark:text-ink-dark/50">
              <th className="px-5 py-3">Username</th>
              <th className="px-5 py-3">Nama</th>
              <th className="px-5 py-3">Peran</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) =>
              editingId === u.id ? (
                <EditUserRow
                  key={u.id}
                  user={u}
                  busy={busy}
                  setBusy={setBusy}
                  error={error}
                  setError={setError}
                  onDone={() => {
                    setEditingId(null);
                    router.refresh();
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : resettingId === u.id ? (
                <ResetPasswordRow
                  key={u.id}
                  user={u}
                  busy={busy}
                  setBusy={setBusy}
                  error={error}
                  setError={setError}
                  onDone={() => {
                    setResettingId(null);
                    router.refresh();
                  }}
                  onCancel={() => setResettingId(null)}
                />
              ) : (
                <tr key={u.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                  <td className="px-5 py-3 font-mono text-xs text-ink/80 dark:text-ink-dark/80">
                    {u.username}
                  </td>
                  <td className="px-5 py-3 font-semibold text-ink dark:text-ink-dark">
                    {u.name}
                    {u.id === currentUserId && (
                      <span className="ml-2 text-xs font-normal text-ink/50 dark:text-ink-dark/50">
                        (anda)
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink/70 dark:text-ink-dark/70">{roleLabels[u.role]}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        u.active
                          ? "bg-secondary/15 text-secondary-dark dark:text-secondary-light"
                          : "bg-cta/10 text-cta"
                      }`}
                    >
                      {u.active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label="Edit"
                        onClick={() => {
                          setEditingId(u.id);
                          setError("");
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 dark:text-primary-light"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Reset password"
                        onClick={() => {
                          setResettingId(u.id);
                          setError("");
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/10 dark:text-primary-light"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Hapus"
                        disabled={u.id === currentUserId}
                        onClick={async () => {
                          if (!window.confirm(`Hapus pengguna "${u.name}"?`)) return;
                          setBusy(true);
                          try {
                            const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
                            if (!res.ok) {
                              setError(await parseError(res));
                              return;
                            }
                            router.refresh();
                          } finally {
                            setBusy(false);
                          }
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-cta hover:bg-cta/10 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {error && (
        <p role="alert" className="mt-3 flex items-center gap-2 text-sm font-semibold text-cta">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
}

type SharedFormProps = {
  busy: boolean;
  setBusy: (v: boolean) => void;
  error: string;
  setError: (v: string) => void;
  onDone: () => void;
  onCancel: () => void;
};

function CreateUserForm({ busy, setBusy, setError, onDone, onCancel }: SharedFormProps) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("editor");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, password, role }),
      });
      if (!res.ok) {
        setError(await parseError(res));
        return;
      }
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 grid gap-4 rounded-lg border border-black/10 p-4 sm:grid-cols-2 dark:border-white/15"
    >
      <div>
        <label htmlFor="new-username" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Username
        </label>
        <input
          id="new-username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>
      <div>
        <label htmlFor="new-name" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Nama
        </label>
        <input
          id="new-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>
      <div>
        <label htmlFor="new-password" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Password Awal
        </label>
        <input
          id="new-password"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </div>
      <div>
        <label htmlFor="new-role" className="block text-sm font-semibold text-ink dark:text-ink-dark">
          Peran
        </label>
        <select
          id="new-role"
          value={role}
          onChange={(e) => setRole(e.target.value as AdminRole)}
          className="mt-1 w-full rounded-lg border border-black/10 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        >
          <option value="editor">Editor - kelola konten</option>
          <option value="owner">Owner - akses penuh + kelola pengguna</option>
        </select>
      </div>
      <div className="flex items-end gap-3 sm:col-span-2">
        <button type="submit" disabled={busy} className="btn-primary disabled:opacity-70">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Simpan
        </button>
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-ink/60 hover:underline dark:text-ink-dark/60">
          Batal
        </button>
      </div>
    </form>
  );
}

function EditUserRow({
  user,
  busy,
  setBusy,
  setError,
  onDone,
  onCancel,
}: SharedFormProps & { user: AdminUserSummary }) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<AdminRole>(user.role);
  const [active, setActive] = useState(user.active);

  const onSave = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, active }),
      });
      if (!res.ok) {
        setError(await parseError(res));
        return;
      }
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <tr className="border-b border-black/5 bg-primary/5 last:border-0 dark:border-white/10 dark:bg-primary/10">
      <td className="px-5 py-3 font-mono text-xs text-ink/80 dark:text-ink-dark/80">{user.username}</td>
      <td className="px-5 py-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Nama"
          className="w-full rounded-lg border border-black/10 px-3 py-1.5 text-sm focus:border-primary focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        />
      </td>
      <td className="px-5 py-3">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as AdminRole)}
          aria-label="Peran"
          className="rounded-lg border border-black/10 px-3 py-1.5 text-sm focus:border-primary focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
        >
          <option value="editor">Editor</option>
          <option value="owner">Owner</option>
        </select>
      </td>
      <td className="px-5 py-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Aktif
        </label>
      </td>
      <td className="px-5 py-3">
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onSave} disabled={busy} className="btn-primary px-3 py-1.5 text-xs disabled:opacity-70">
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Simpan
          </button>
          <button type="button" onClick={onCancel} aria-label="Batal" className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-black/5 dark:text-ink-dark/60">
            <X className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ResetPasswordRow({
  user,
  busy,
  setBusy,
  setError,
  onDone,
  onCancel,
}: SharedFormProps & { user: AdminUserSummary }) {
  const [password, setPassword] = useState("");

  const onSave = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError(await parseError(res));
        return;
      }
      onDone();
    } finally {
      setBusy(false);
    }
  };

  return (
    <tr className="border-b border-black/5 bg-primary/5 last:border-0 dark:border-white/10 dark:bg-primary/10">
      <td className="px-5 py-3 font-mono text-xs text-ink/80 dark:text-ink-dark/80">{user.username}</td>
      <td colSpan={3} className="px-5 py-3">
        <label className="flex items-center gap-2 text-sm">
          Password baru untuk {user.name}:
          <input
            type="password"
            autoFocus
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-black/10 px-3 py-1.5 text-sm focus:border-primary focus:outline-none dark:border-white/15 dark:bg-white/5 dark:text-ink-dark"
          />
        </label>
      </td>
      <td className="px-5 py-3">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={busy || password.length < 8}
            className="btn-primary px-3 py-1.5 text-xs disabled:opacity-70"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Simpan
          </button>
          <button type="button" onClick={onCancel} aria-label="Batal" className="flex h-9 w-9 items-center justify-center rounded-full text-ink/60 hover:bg-black/5 dark:text-ink-dark/60">
            <X className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
