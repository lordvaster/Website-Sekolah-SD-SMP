// Author: Zeday | https://join.co.id
export default function SkipToContent({ label = "Lompat ke konten utama" }: { label?: string }) {
  return (
    <a href="#konten-utama" className="skip-link">
      {label}
    </a>
  );
}
