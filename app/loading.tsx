// Author: Zeday | https://join.co.id
export default function Loading() {
  return (
    <div className="container-page animate-pulse py-14">
      <div className="mx-auto h-8 w-2/3 max-w-md rounded-full bg-primary/10" />
      <div className="mx-auto mt-4 h-4 w-1/2 max-w-sm rounded-full bg-primary/10" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-56 rounded-xl2 bg-primary/10" />
        ))}
      </div>
    </div>
  );
}
