export default function ContactLoading() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl space-y-4 animate-pulse">
          <div className="h-8 w-36 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-12 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>

        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div className="h-[640px] rounded-2xl border border-border bg-white dark:bg-slate-900/70" />
          <div className="h-[360px] rounded-2xl border border-border bg-white dark:bg-slate-900/70" />
        </div>
      </div>
    </div>
  );
}

