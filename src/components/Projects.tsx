import { useState } from "react";
import { projects, visibleOnly, type Project } from "@/services/content";
import { Section } from "./Section";
import { ChevronDown, ExternalLink, Github } from "lucide-react";

export function Projects() {
  if (!projects.visible) return null;
  const items = visibleOnly(projects.items);
  if (items.length === 0) return null;

  return (
    <Section id="projects" eyebrow="selected work" title="Projects">
      <div className="grid gap-5">
        {items.map((p, i) => (
          <ProjectCard key={i} project={p} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="group rounded-lg border border-border bg-card/60 p-6 transition hover:border-accent/40 hover:bg-card">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight">{project.title}</h3>
        <div className="flex items-center gap-2">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-accent">
              <Github className="h-4 w-4" />
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noreferrer" aria-label="Demo" className="text-muted-foreground hover:text-accent">
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        {project.tags?.map((t) => (
          <span key={t} className="text-accent">{t}</span>
        ))}
        {project.tags?.length > 0 && project.stack?.length > 0 && (
          <span className="text-muted-foreground/40">|</span>
        )}
        {project.stack?.map((s) => (
          <span key={s} className="text-muted-foreground">{s}</span>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <div className="text-[0.7rem] tracking-[0.2em] text-muted-foreground">THE PROBLEM</div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{project.problem}</p>
        </div>
        <div>
          <div className="text-[0.7rem] tracking-[0.2em] text-muted-foreground">THE OUTCOME</div>
          <p className="mt-1 text-sm text-foreground leading-relaxed">{project.outcome}</p>
        </div>
      </div>

      {project.duration && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-5 inline-flex items-center gap-1 text-xs text-accent hover:underline"
        >
          {open ? "Hide" : "Deep Dive: Timeline & Stack"}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
      {open && (
        <div className="mt-4 grid gap-2 rounded-md border border-border bg-background/50 p-4 text-xs text-muted-foreground animate-fade-in">
          <div><span className="text-foreground">Duration:</span> {project.duration}</div>
          <div><span className="text-foreground">Stack:</span> {project.stack?.join(", ")}</div>
        </div>
      )}
    </article>
  );
}
