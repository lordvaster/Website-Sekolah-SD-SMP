// Author: Zeday | https://join.co.id
"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    // Hanya didaftarkan di production. sw.js memakai strategi ambil-dulu-
    // baru-cache dengan skipWaiting + clients.claim (ambil alih langsung),
    // yang di `next dev` malah bisa menyajikan chunk HMR/dev lama dari cache
    // sehingga perubahan kode terasa "tidak muncul" tanpa sebab yang jelas.
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Diamkan: PWA tetap opsional, situs harus tetap berfungsi tanpa SW.
      });
    }
  }, []);

  return null;
}
