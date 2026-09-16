// Author: Zeday | https://join.co.id
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  // scripts/** berisi utilitas CommonJS biasa yang dijalankan langsung
  // lewat `node` di luar build Next.js (mis. deploy/backup.sh) - bukan
  // bagian dari aplikasi yang dicek aturan TypeScript/import project ini.
  { ignores: [".next/**", "node_modules/**", "scripts/**"] },
];

export default eslintConfig;
