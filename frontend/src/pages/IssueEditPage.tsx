import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError, getIssue, updateIssue } from '../api'
import type { IssueDraft } from '../api'
import { AddIssueForm } from '../components/AddIssueForm'
import type { Issue } from '../types'

type LoadState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'loaded'; issue: Issue }

export function IssueEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [state, setState] = useState<LoadState>({ kind: 'loading' })

  // Load the issue using the ID from the page address
  useEffect(() => {
    if (!id) return

    let ignore = false
    setState({ kind: 'loading' })

    const load = async () => {
      try {
        const issue = await getIssue(id)
        if (!ignore) setState({ kind: 'loaded', issue })
      } catch (err) {
        if (ignore) return
        setState({
          kind: 'error',
          message: err instanceof ApiError
            ? err.message
            : 'Could not reach the server',
        })
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [id])

  // Save changes to the API, then return to the issue list
  async function handleSave(draft: IssueDraft) {
    if (!id) return
    await updateIssue(id, draft)
    navigate('/')
  }

  return (
    <section className="flex flex-col gap-4">
      <h2>Edit issue</h2>
      <Link to="/">Back to all issues</Link>

      {state.kind === 'loading' && (
        <p role="status">Loading issue…</p>
      )}

      {state.kind === 'error' && (
        <p role="alert">{state.message}</p>
      )}

      {state.kind === 'loaded' && (
        <AddIssueForm
          onAdd={handleSave}
          initial={{
            title: state.issue.title,
            description: state.issue.description,
            stepsToReproduce: state.issue.stepsToReproduce,
            priority: state.issue.priority,
          }}
          submitLabel="Save changes"
          clearOnSuccess={false}
        />
      )}
    </section>
  )
}
