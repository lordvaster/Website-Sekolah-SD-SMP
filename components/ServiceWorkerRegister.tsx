// Author: Zeday | https://join.co.id
"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Diamkan: PWA tetap opsional, situs harus tetap berfungsi tanpa SW.
      });
    }
  }, []);

  return null;
}
