export function Footer() {
  return (
    <footer className="mt-auto py-12">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs text-muted-foreground/40">
            &copy; {new Date().getFullYear()} Blank. Perth, Australia.
          </p>
          <p className="text-xs text-muted-foreground/30">
            Substance over status.
          </p>
        </div>
      </div>
    </footer>
  );
}
