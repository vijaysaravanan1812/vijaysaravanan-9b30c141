import { useState } from "react";
import { contact, visibleOnly } from "@/services/content";
import { Section } from "./Section";
import { ArrowRight } from "lucide-react";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  if (!contact.visible) return null;
  const links = visibleOnly(contact.links);

  return (
    <Section id="contact" eyebrow="get in touch" title="Contact">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold leading-snug">{contact.heading}</h3>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{contact.subheading}</p>

          <a
            href={`mailto:${contact.email}`}
            className="mt-6 inline-flex items-center gap-2 text-accent hover:underline"
          >
            {contact.email}
            <ArrowRight className="h-4 w-4" />
          </a>

          <div className="mt-8 flex flex-wrap gap-2">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="chip hover:border-accent/50 hover:text-foreground transition"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const subject = encodeURIComponent(`Portfolio — ${form.name || "Hello"}`);
            const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
            window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
            setSent(true);
          }}
          className="rounded-lg border border-border bg-card/60 p-6 space-y-4"
        >
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="Message" textarea value={form.message} onChange={(v) => setForm({ ...form, message: v })} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            {sent ? "Opened in mail client" : "Send Message"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Section>
  );
}

function Field({
  label, value, onChange, type = "text", textarea = false,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean }) {
  const cls = "mt-1 w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-accent transition";
  return (
    <label className="block">
      <span className="text-xs tracking-[0.18em] text-muted-foreground">// {label.toUpperCase()}</span>
      {textarea ? (
        <textarea required rows={4} className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input required type={type} className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}
