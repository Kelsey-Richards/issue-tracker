import { useEffect, useState } from "react";
import { ApiError, listIssues } from "../api";
import { IssueList } from "../components/IssueList";
import type { Issue } from "../types";

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; issues: Issue[] };

export function IssueListPage() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  // Load issues from our API when the page opens.
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const issues = await listIssues();
        if (!ignore) setState({ kind: "loaded", issues });
      } catch (err) {
        if (ignore) return;
        setState({
          kind: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "Could not reach the server",
        });
      }
    };

    load();

    // Ignore responses if the component is no longer active.
    return () => {
      ignore = true;
    };
  }, []);

  // Display the correct message based on the loading state.
  if (state.kind === "loading") return <p role="status">Loading issues…</p>;
  if (state.kind === "error") return <p role="alert">{state.message}</p>;
  if (state.issues.length === 0)
    return <p>No issues yet. Add the first one.</p>;

  return <IssueList issues={state.issues} />;
}
