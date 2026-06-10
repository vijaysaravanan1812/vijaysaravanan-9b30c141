import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { profile, autoStats } from "@/services/content";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Education } from "@/components/Education";
import { Publications } from "@/components/Publications";
import { Certifications } from "@/components/Certifications";
import { Achievements } from "@/components/Achievements";
import { CompetitiveProgramming } from "@/components/CompetitiveProgramming";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Featured } from "@/components/Featured";
import { Stats } from "@/components/Stats";
import { SectionBoundary } from "@/components/SectionBoundary";
import { SkipLink } from "@/components/SkipLink";
import { ResumeArchive } from "@/components/ResumeArchive";

// Below-the-fold sections: lazy-loaded to keep first paint small.
const Timeline = lazy(() => import("@/components/Timeline").then((m) => ({ default: m.Timeline })));
const OpenSource = lazy(() =>
  import("@/components/OpenSource").then((m) => ({ default: m.OpenSource })),
);
const Talks = lazy(() => import("@/components/Talks").then((m) => ({ default: m.Talks })));
const Awards = lazy(() => import("@/components/Awards").then((m) => ({ default: m.Awards })));
const Blog = lazy(() => import("@/components/Blog").then((m) => ({ default: m.Blog })));
const Startups = lazy(() => import("@/components/Startups").then((m) => ({ default: m.Startups })));
const Products = lazy(() => import("@/components/Products").then((m) => ({ default: m.Products })));
const Patents = lazy(() => import("@/components/Patents").then((m) => ({ default: m.Patents })));
const Mentoring = lazy(() =>
  import("@/components/Mentoring").then((m) => ({ default: m.Mentoring })),
);
const Media = lazy(() => import("@/components/Media").then((m) => ({ default: m.Media })));
const Testimonials = lazy(() =>
  import("@/components/Testimonials").then((m) => ({ default: m.Testimonials })),
);

const SITE_URL = "https://vijaysaravanan.lovable.app";
const desc = profile.summary.slice(0, 155);

export const Route = createFileRoute("/")({
  head: () => {
    const stats = autoStats();
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.name,
      jobTitle: profile.role,
      description: profile.summary,
      url: SITE_URL,
      sameAs: profile.socials.filter((s) => s.visible && s.type !== "email").map((s) => s.url),
    };
    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: `${profile.name} — ${profile.role}`,
      url: SITE_URL,
    };
    return {
      meta: [
        { title: `${profile.name} — ${profile.role}` },
        { name: "description", content: desc },
        { name: "author", content: profile.name },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: `${profile.name} — ${profile.role}` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: SITE_URL },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${profile.name} — ${profile.role}` },
        { name: "twitter:description", content: desc },
        {
          name: "keywords",
          content: `${profile.name}, ${profile.role}, portfolio, ${stats.projects} projects`,
        },
      ],
      links: [
        { rel: "canonical", href: SITE_URL },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
        },
      ],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(jsonLd) },
        { type: "application/ld+json", children: JSON.stringify(website) },
      ],
    };
  },
  component: Index,
});

function B({ name, children }: { name: string; children: React.ReactNode }) {
  return <SectionBoundary name={name}>{children}</SectionBoundary>;
}

function Index() {
  return (
    <div className="min-h-screen">
      <SkipLink />
      <Nav />
      <main id="main">
        <B name="Hero">
          <Hero />
        </B>
        <B name="About">
          <About />
        </B>
        <B name="Featured">
          <Featured />
        </B>
        <B name="Experience">
          <Experience />
        </B>
        <B name="Projects">
          <Projects />
        </B>
        <B name="Skills">
          <Skills />
        </B>
        <B name="CompetitiveProgramming">
          <CompetitiveProgramming />
        </B>
        <B name="Stats">
          <Stats />
        </B>
        <B name="Education">
          <Education />
        </B>
        <B name="Publications">
          <Publications />
        </B>
        <B name="Certifications">
          <Certifications />
        </B>
        <B name="Achievements">
          <Achievements />
        </B>
        <Suspense fallback={null}>
          <B name="Timeline">
            <Timeline />
          </B>
          <B name="OpenSource">
            <OpenSource />
          </B>
          <B name="Talks">
            <Talks />
          </B>
          <B name="Awards">
            <Awards />
          </B>
          <B name="Blog">
            <Blog />
          </B>
          <B name="Startups">
            <Startups />
          </B>
          <B name="Products">
            <Products />
          </B>
          <B name="Patents">
            <Patents />
          </B>
          <B name="Mentoring">
            <Mentoring />
          </B>
          <B name="Media">
            <Media />
          </B>
          <B name="Testimonials">
            <Testimonials />
          </B>
        </Suspense>
        <B name="ResumeArchive">
          <ResumeArchive />
        </B>
        <B name="Contact">
          <Contact />
        </B>
      </main>
      <Footer />
    </div>
  );
}
