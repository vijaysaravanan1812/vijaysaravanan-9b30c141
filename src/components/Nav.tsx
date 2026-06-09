import { useEffect, useState } from "react";
import { siteConfig, visibleNavSections } from "@/services/content";
import { Menu, Moon, Sun, Search } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { SearchPalette } from "./SearchPalette";
import { TypingText } from "./TypingText";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const { theme, toggle } = useTheme();

  const sections = visibleNavSections();
  const roles = siteConfig.rotatingRoles;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 3200);
    return () => clearInterval(t);
  }, [roles.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="text-sm font-medium tracking-tight">
            <TypingText
              key={roleIdx}
              as="span"
              text={roles[roleIdx]}
              speed={70}
              animateOnView={false}
              persistCursor
            />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search (Ctrl/Cmd+K)"
              title="Search (⌘K)"
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:border-accent/50 transition"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:border-accent/50 transition"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <span
              className="hidden md:inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400/60"
              aria-hidden
            />
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground hover:border-accent/50 transition"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[88vw] sm:max-w-sm">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Jump to any section of the portfolio
            </SheetDescription>
          </SheetHeader>
          <nav className="mt-6 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-8rem)]" aria-label="Primary">
            {sections.map((s) => {
              const isActive = activeId === s.id;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => handleNavClick(e, s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative rounded-md px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-accent/10 text-foreground"
                      : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                  }`}
                >
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-accent transition-all ${
                      isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                    }`}
                    aria-hidden
                  />
                  {s.label}
                </a>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <SearchPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
