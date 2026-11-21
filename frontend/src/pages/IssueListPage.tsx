import { useEffect, useState } from 'react'
import { ApiError, createIssue, deleteIssue, listIssues, setStatus } from '../api'
import type { IssueDraft } from '../api'
import { AddIssueForm } from '../components/AddIssueForm'
import { IssueList } from '../components/IssueList'
import type { Issue, Status } from '../types'

type LoadState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'loaded'; issues: Issue[] }

// Use the same styling for all error messages.
const alertClass =
  'rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'

function messageFor(err: unknown): string {
  return err instanceof ApiError ? err.message : 'Could not reach the server'
}

type IssueListPageProps = {
  onSelect?: (id: string) => void
}

export function IssueListPage({ onSelect }: IssueListPageProps) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' })
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const issues = await listIssues()
        if (!ignore) setState({ kind: 'loaded', issues })
      } catch (err) {
        if (!ignore) setState({ kind: 'error', message: messageFor(err) })
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  function replaceIssues(change: (issues: Issue[]) => Issue[]) {
    setState((current) =>
      current.kind === 'loaded'
        ? { kind: 'loaded', issues: change(current.issues) }
        : current,
    )
  }

  async function handleAdd(draft: IssueDraft) {
    const created = await createIssue(draft)
    replaceIssues((issues) => [...issues, created])
  }

  async function handleStatusChange(id: string, status: Status) {
    setActionError(null)
    try {
      const updated = await setStatus(id, status)
      replaceIssues((issues) => issues.map((i) => (i._id === id ? updated : i)))
    } catch (err) {
      setActionError(messageFor(err))
    }
  }

  async function handleDelete(id: string) {
    setActionError(null)
    try {
      await deleteIssue(id)
      replaceIssues((issues) => issues.filter((i) => i._id !== id))
    } catch (err) {
      setActionError(messageFor(err))
    }
  }

  if (state.kind === 'loading') {
    return <p role="status" className="text-sm text-muted-foreground">Loading issues…</p>
  }

  if (state.kind === 'error') {
    return <p role="alert" className={alertClass}>{state.message}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <AddIssueForm onAdd={handleAdd} />

      {actionError && (
        <p role="alert" className={alertClass}>{actionError}</p>
      )}

      {state.issues.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No issues yet. Add the first one.
        </p>
      ) : (
        <IssueList
          issues={state.issues}
          onSelect={onSelect}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
