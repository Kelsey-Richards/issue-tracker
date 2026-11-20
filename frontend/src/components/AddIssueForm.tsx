import { useState } from "react";
import { ApiError } from "../api";
import type { IssueDraft } from "../api";
import type { Priority } from "../types";

type AddIssueFormProps = {
  onAdd: (draft: IssueDraft) => Promise<void> | void;
  initial?: IssueDraft;
  submitLabel?: string;
  clearOnSuccess?: boolean;
};

const priorities: Priority[] = ["low", "medium", "high"];

function isPriority(value: string): value is Priority {
  return priorities.some((p) => p === value);
}

// Store validation messages for the required fields.
type Problems = {
  title?: string;
  description?: string;
  stepsToReproduce?: string;
};


// Keep track of the information entered into the form.
export function AddIssueForm({
  onAdd,
  initial,
  submitLabel = 'Add issue',
  clearOnSuccess = true,
}: AddIssueFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [steps, setSteps] = useState(initial?.stepsToReproduce ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium')
  const [problems, setProblems] = useState<Problems>({})
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // Update the priority when someone selects a different option.
  function handlePriorityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (isPriority(e.target.value)) {
      setPriority(e.target.value)
    }
  }

  // Check the form and send the issue when someone clicks Add.
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerMessage(null)

    // Remove extra spaces from the information entered.
    const draft: IssueDraft = {
      title: title.trim(),
      description: description.trim(),
      stepsToReproduce: steps.trim(),
      priority,
    }

    // Check that all required fields have information.
    const found: Problems = {}

    if (draft.title === '') found.title = 'Title is required'
    if (draft.description === '') found.description = 'Description is required'
    if (draft.stepsToReproduce === '') {
      found.stepsToReproduce = 'Steps to reproduce are required'
    }

    setProblems(found)
    if (Object.keys(found).length > 0) return

    // Send the issue and handle success or errors.
    setBusy(true)

    try {
      await onAdd(draft)

      if (clearOnSuccess) {
        setTitle('')
        setDescription('')
        setSteps('')
      }
    } catch (err) {
      setServerMessage(
        err instanceof ApiError ? err.message : 'Could not reach the server'
      )
    } finally {
      setBusy(false)
    }
  }

  // Display the form fields and validation messages.
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      {problems.title && <p role="alert">{problems.title}</p>}

      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      {problems.description && <p role="alert">{problems.description}</p>}

      <label>
        Steps to reproduce
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
        />
      </label>
      {problems.stepsToReproduce && (
        <p role="alert">{problems.stepsToReproduce}</p>
      )}

      <label>
        Priority
        <select value={priority} onChange={handlePriorityChange}>
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      {serverMessage && <p role="alert">{serverMessage}</p>}

      <button type="submit" disabled={busy}>
        {submitLabel}
      </button>
    </form>
  )
}
