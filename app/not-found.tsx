// Author: Zeday | https://join.co.id
import Link from "next/link";
import PlaceholderPhoto from "@/components/PlaceholderPhoto";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center gap-6 py-20 text-center">
      <div className="w-full max-w-xs overflow-hidden rounded-xl2">
        <PlaceholderPhoto hue={28} label="404" className="w-full" />
      </div>
      <h1 className="font-heading text-3xl font-extrabold text-ink dark:text-ink-dark">
        Halaman Tidak Ditemukan
      </h1>
      <p className="max-w-md text-ink/70 dark:text-ink-dark/70">
        Sepertinya halaman yang anda cari tidak ada atau sudah dipindahkan.
        Mari kembali ke beranda.
      </p>
      <Link href="/" className="btn-primary">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
