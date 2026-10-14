import JoinForm from "./join-form";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid mask-[radial-gradient(ellipse_70%_55%_at_50%_0%,black_5%,transparent_70%)]" />
        <div className="absolute left-1/2 -top-60 h-120 w-200 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[130px]" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 shadow-sm">
            <SparkIcon className="h-4 w-4 text-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">AI Maker</span>
        </div>
        <span className="flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs text-muted-foreground shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          即将上线
        </span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="animate-fade-up text-balance max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          加入 <span className="text-primary">AI Maker</span> 等待列表
        </h1>
        <p
          className="animate-fade-up text-balance mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
          style={{ animationDelay: "80ms" }}
        >
          成为首批体验用户,抢先获取早期访问资格与专属权益。
        </p>

        <div
          className="animate-fade-up mt-8 w-full max-w-sm"
          style={{ animationDelay: "160ms" }}
        >
          <JoinForm />
        </div>

        <p
          className="animate-fade-up mt-4 text-xs text-muted-foreground"
          style={{ animationDelay: "240ms" }}
        >
          无垃圾邮件,只在产品上线时通知你
        </p>
      </main>

      <footer className="relative z-10 py-6 text-center text-xs text-muted-foreground">
        © 2026 AI Maker
      </footer>
    </div>
  );
}

function SparkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c.6 4.9 3.1 7.4 8 8-4.9.6-7.4 3.1-8 8-.6-4.9-3.1-7.4-8-8 4.9-.6 7.4-3.1 8-8z" />
    </svg>
  );
}
