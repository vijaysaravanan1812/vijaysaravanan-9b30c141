import profile from "@/data/profile.json";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-6 text-xs text-muted-foreground md:flex-row md:items-center">
        <div>
          © {new Date().getFullYear()} {profile.name}. Built with care, deployed with caution.
        </div>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/60" />
          systems online
        </div>
      </div>
    </footer>
  );
}
