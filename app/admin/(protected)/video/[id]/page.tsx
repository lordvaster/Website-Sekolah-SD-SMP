// Author: Zeday | https://join.co.id
import { notFound } from "next/navigation";
import VideoForm from "@/components/admin/VideoForm";
import { getVideoById } from "@/lib/repositories/videos";

export const dynamic = "force-dynamic";

export default async function AdminEditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = getVideoById(Number(id));
  if (!video) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-2xl font-bold text-ink dark:text-ink-dark">Edit Video</h1>
      <div className="mt-8 card p-6 sm:p-8">
        <VideoForm initial={video} />
      </div>
    </div>
  );
}
