export default function ProductLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 h-8 w-32 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-xl bg-muted" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded-lg bg-muted" />
          <div className="h-20 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-32 w-full animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
