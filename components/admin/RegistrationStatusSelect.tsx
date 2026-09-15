// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RegistrationStatus } from "@/lib/repositories/registrations";

const statusStyles: Record<RegistrationStatus, string> = {
  baru: "bg-primary/10 text-primary dark:text-primary-light",
  dihubungi: "bg-accent/15 text-accent-dark dark:text-accent",
  diterima: "bg-secondary/15 text-secondary-dark dark:text-secondary-light",
  ditolak: "bg-cta/10 text-cta",
};

const statusLabels: Record<RegistrationStatus, string> = {
  baru: "Baru",
  dihubungi: "Dihubungi",
  diterima: "Diterima",
  ditolak: "Ditolak",
};

export default function RegistrationStatusSelect({
  id,
  status,
}: {
  id: number;
  status: RegistrationStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  const onChange = async (next: RegistrationStatus) => {
    setCurrent(next);
    setSaving(true);
    try {
      await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={current}
      disabled={saving}
      onChange={(e) => onChange(e.target.value as RegistrationStatus)}
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${statusStyles[current]}`}
    >
      {(Object.keys(statusLabels) as RegistrationStatus[]).map((s) => (
        <option key={s} value={s}>
          {statusLabels[s]}
        </option>
      ))}
    </select>
  );
}
