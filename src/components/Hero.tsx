import { profile } from "@/services/content";
import { visibleOnly } from "@/services/content";
import { ArrowRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { TypingText } from "./TypingText";

const iconMap = { github: Github, linkedin: Linkedin, email: Mail } as const;

export function Hero() {
  if (!profile.visible) return null;
  const stats = visibleOnly(profile.stats);
  const socials = visibleOnly(profile.socials);

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16"
    >
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute inset-0 glow pointer-events-none" />

      <div className="relative mx-auto w-full max-w-5xl px-6">
        <div className="mb-6 inline-flex items-center gap-2 text-xs tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-8 bg-accent" />
          <TypingText
            as="span"
            text={profile.label}
            speed={40}
            animateOnView={false}
            persistCursor={false}
          />
        </div>

        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          {profile.name}
        </h1>

        <TypingText
          as="p"
          text={profile.tagline}
          speed={45}
          animateOnView={false}
          persistCursor={false}
          className="mt-4 text-xl italic text-accent md:text-2xl"
        />

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {profile.summary}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            View Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={profile.resumeUrl}
            download
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card/40 px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-accent/50"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
          {socials.map((s) => {
            const Icon = iconMap[s.type as keyof typeof iconMap];
            if (!Icon) return null;
            return (
              <a
                key={s.type}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.type}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/40 text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>

        {stats.length > 0 && (
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-border pt-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold tracking-tight text-foreground">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
