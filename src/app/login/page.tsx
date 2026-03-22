import { Suspense } from "react";
import { LoginForm } from "@/app/login/login-form";

function LoginFallback() {
  return (
    <div className="h-48 w-full max-w-sm animate-pulse rounded-xl border border-border bg-muted/40" aria-hidden />
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left — branded panel (hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-[52%] flex-col justify-between p-12 text-white"
        style={{ background: "linear-gradient(155deg, hsl(220 45% 16%) 0%, hsl(220 55% 10%) 100%)" }}
      >
        {/* Logo mark */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-slate-900">
            TC
          </div>
          <div>
            <p className="text-base font-semibold tracking-tight text-white">TREP Cap IQ</p>
            <p className="text-xs text-white/50">Investor Relations Platform</p>
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
            Manage your capital<br />
            <span className="text-amber-400">relationships</span> at scale.
          </h1>
          <p className="text-base text-white/60 leading-relaxed max-w-sm">
            A purpose-built CRM for real estate private equity — deal pipelines,
            investor tracking, and activity logging all in one place.
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3">
            {[
              "Full investor contact & company database",
              "Kanban deal pipeline with stage tracking",
              "Activity timeline across all relationships",
              "AI-assisted investor outreach summaries",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} TREP Capital. All rights reserved.
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2.5 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            TC
          </div>
          <span className="text-base font-semibold text-foreground">TREP Cap IQ</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your workspace</p>
          </div>
          <Suspense fallback={<LoginFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
