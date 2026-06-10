import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Vite injects BASE_URL from the `base` config (e.g. "/vijaysaravanan-9b30c141/"
  // for GitHub Pages, "/" for Netlify/root deploys). Strip the trailing slash for
  // the router basepath since TanStack expects no trailing slash (except for "/").
  const rawBase = import.meta.env.BASE_URL ?? "/";
  const basepath = rawBase === "/" ? "/" : rawBase.replace(/\/$/, "");

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath,
  });

  return router;
};
