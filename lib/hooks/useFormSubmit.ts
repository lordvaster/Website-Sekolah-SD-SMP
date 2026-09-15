// Author: Zeday | https://join.co.id
"use client";

import { useEffect, useRef, useState } from "react";

type SubmitStatus = "idle" | "success" | "error";

const DEFAULT_ERROR_MESSAGE = "Terjadi kesalahan, silakan coba lagi.";

// Dipakai bersama oleh ContactForm & RegistrationForm agar state
// idle/success/error dan cara memanggil endpoint tidak terduplikasi.
export function useFormSubmit<T>(endpoint: string) {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState(DEFAULT_ERROR_MESSAGE);

  // Menjaga agar (a) tidak setState setelah komponen unmount, dan (b) hasil
  // dari submit yang lebih lama tidak menimpa status dari submit yang lebih
  // baru kalau dua pengiriman sempat tumpang tindih.
  const mountedRef = useRef(true);
  const requestIdRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const submit = async (data: T) => {
    const requestId = ++requestIdRef.current;
    setStatus("idle");

    let ok = false;
    let message = DEFAULT_ERROR_MESSAGE;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        ok = true;
      } else {
        const body = await res.json().catch(() => ({}));
        if (typeof body?.error === "string") message = body.error;
      }
    } catch {
      // Kegagalan jaringan: pakai pesan default.
    }

    if (!mountedRef.current || requestIdRef.current !== requestId) {
      // Komponen sudah unmount, atau sudah ada submit lebih baru setelah
      // ini - abaikan hasil yang basi ini.
      return ok;
    }

    if (ok) {
      setStatus("success");
    } else {
      setErrorMessage(message);
      setStatus("error");
    }
    return ok;
  };

  return { status, errorMessage, submit };
}
