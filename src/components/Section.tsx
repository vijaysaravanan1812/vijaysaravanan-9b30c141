import { type ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";

interface SectionProps {
  id: string;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
}

export function Section({ id, title, eyebrow, children }: SectionProps) {
  const { ref, inView } = useInView<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className={`scroll-mt-nav py-24 md:py-32 fade-up ${inView ? "in-view" : ""}`}
    >
      <div className="mx-auto max-w-5xl px-6">
        {eyebrow && (
          <div className="mb-3 text-xs tracking-[0.2em] text-muted-foreground">// {eyebrow}</div>
        )}
        {title && <h2 className="section-title mb-12">{title}</h2>}
        {children}
      </div>
    </section>
  );
}
