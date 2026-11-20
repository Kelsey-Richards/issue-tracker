import { useEffect, useState } from 'react'
import { ApiError, createIssue, deleteIssue, listIssues, setStatus } from '../api'
import type { IssueDraft } from '../api'
import { AddIssueForm } from '../components/AddIssueForm'
import { IssueList } from '../components/IssueList'
import type { Issue, Status } from '../types'

type LoadState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "loaded"; issues: Issue[] };

// Get a readable error message from the API.
function messageFor(err: unknown): string {
  return err instanceof ApiError
    ? err.message
    : 'Could not reach the server'
}

// Allow the parent page to handle clicking View
type IssueListPageProps = {
  onSelect?: (id: string) => void
}

export function IssueListPage({ onSelect }: IssueListPageProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [actionError, setActionError] = useState<string | null>(null)

  // Load issues from our API when the page opens.
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const issues = await listIssues();
        if (!ignore) setState({ kind: "loaded", issues });
      } catch (err) {
        if (!ignore) {
          setState({ kind: 'error', message: messageFor(err) })
        }
      }
    };

    load();

    // Ignore responses if the component is no longer active.
    return () => {
      ignore = true;
    };
  }, []);

  // Update the issue list using its latest data.
  function replaceIssues(change: (issues: Issue[]) => Issue[]) {
    setState((current) =>
      current.kind === 'loaded'
        ? { kind: 'loaded', issues: change(current.issues) }
        : current
    )
  }

  // Add a new issue after the API confirms it was created.
  async function handleAdd(draft: IssueDraft) {
    const created = await createIssue(draft)
    replaceIssues((issues) => [...issues, created])
  }

  // Change an issue's status after the API confirms the update.
  async function handleStatusChange(id: string, status: Status) {
    setActionError(null)

    try {
      const updated = await setStatus(id, status)
      replaceIssues((issues) =>
        issues.map((i) => (i._id === id ? updated : i))
      )
    } catch (err) {
      setActionError(messageFor(err))
    }
  }

  // Remove an issue only after the API confirms deletion.
  async function handleDelete(id: string) {
    setActionError(null)

    try {
      await deleteIssue(id)
      replaceIssues((issues) =>
        issues.filter((i) => i._id !== id)
      )
    } catch (err) {
      setActionError(messageFor(err))
    }
  }

  if (state.kind === 'loading') return <p role="status">Loading issues…</p>
  if (state.kind === 'error') return <p role="alert">{state.message}</p>

  // Show the form, any errors, and our issue list.
  return (
    <>
      <AddIssueForm onAdd={handleAdd} />

      {actionError && <p role="alert">{actionError}</p>}

      {state.issues.length === 0 ? (
        <p>No issues yet. Add the first one.</p>
      ) : (
        <IssueList
          issues={state.issues}
          onSelect={onSelect}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </>
  )
}

