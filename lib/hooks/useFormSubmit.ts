// Author: Zeday | https://join.co.id
"use client";

import { useState } from "react";

type SubmitStatus = "idle" | "success" | "error";

// Dipakai bersama oleh ContactForm & RegistrationForm agar state
// idle/success/error dan cara memanggil endpoint tidak terduplikasi.
export function useFormSubmit<T>(endpoint: string) {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const submit = async (data: T) => {
    setStatus("idle");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Gagal mengirim");
      setStatus("success");
      return true;
    } catch {
      setStatus("error");
      return false;
    }
  };

  return { status, submit };
}
