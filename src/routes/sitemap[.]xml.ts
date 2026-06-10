import { createFileRoute } from "@tanstack/react-router";
import { visibleNavSections } from "@/services/content";

const BASE_URL = "https://vijaysaravanan.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const sections = visibleNavSections().map((s) => `${BASE_URL}/#${s.id}`);
        const urls = [BASE_URL + "/", ...sections]
          .map(
            (u) =>
              `  <url>\n    <loc>${u}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${u.endsWith("/") ? "1.0" : "0.7"}</priority>\n  </url>`,
          )
          .join("\n");
        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
