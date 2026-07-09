import { Card, CardContent } from "@/components/ui/card";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/80 ${className}`} />;
}

export default function AppLoading() {
  return (
    <section className="flex w-full flex-col gap-6 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-5 w-48" />
          <SkeletonBlock className="h-4 w-72 max-w-full" />
        </div>
        <SkeletonBlock className="h-10 w-36" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
            <CardContent className="flex min-h-28 items-center gap-4 p-5">
              <SkeletonBlock className="size-11 rounded-full" />
              <div className="flex-1 space-y-3">
                <SkeletonBlock className="h-3 w-28" />
                <SkeletonBlock className="h-7 w-16" />
                <SkeletonBlock className="h-3 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="size-9 rounded-full" />
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-3 w-52" />
              </div>
            </div>
            <SkeletonBlock className="h-4 w-40" />
          </div>
          <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-10 w-full xl:w-52" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
            <CardContent className="space-y-4 p-5">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-5 w-4/5" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="hidden border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] lg:block">
        <CardContent className="space-y-4 p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4">
              <SkeletonBlock className="h-4" />
              <SkeletonBlock className="h-4" />
              <SkeletonBlock className="h-4" />
              <SkeletonBlock className="h-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
