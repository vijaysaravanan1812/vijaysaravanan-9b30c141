import { Component, type ReactNode } from "react";

interface Props {
  name: string;
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/**
 * Wrap each section so a render or validation error degrades to a
 * small inline fallback instead of crashing the whole portfolio.
 */
export class SectionBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error(`[SectionBoundary:${this.props.name}]`, error);
  }

  render() {
    if (this.state.error) {
      return (
        <section
          role="alert"
          aria-label={`${this.props.name} unavailable`}
          className="mx-auto max-w-5xl px-6 py-8"
        >
          <div className="rounded-lg border border-border bg-card/60 p-5 text-sm">
            <div className="font-semibold">This section couldn't be displayed.</div>
            <p className="mt-1 text-xs text-muted-foreground">
              The rest of the page is still working. ({this.props.name})
            </p>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
