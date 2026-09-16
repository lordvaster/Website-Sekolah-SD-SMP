// Author: Zeday | https://join.co.id
import VideoForm from "@/components/admin/VideoForm";

export default function AdminNewVideoPage() {
  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">
        Tambah Video
      </h1>
      <div className="mt-8 card p-6 sm:p-8">
        <VideoForm />
      </div>
    </div>
  );
}
