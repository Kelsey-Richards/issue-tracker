import { useState } from "react";
import type { Issue, StatusFilter } from "../types";
import { IssueCard } from "./IssueCard";

type IssueListProps = {
  issues: Issue[];
  onSelect?: (id: string) => void;
};

const filters: StatusFilter[] = ["all", "open", "in-progress", "closed"];

// Check if the selected value is a valid filter.
function isStatusFilter(value: string): value is StatusFilter {
  return filters.some((f) => f === value);
}

// Display issues and allow filtering by status.
export function IssueList({ issues, onSelect }: IssueListProps) {
  const [filter, setFilter] = useState<StatusFilter>("all");

  function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (isStatusFilter(e.target.value)) {
      setFilter(e.target.value);
    }
  }

  const shown =
    filter === "all" ? issues : issues.filter((i) => i.status === filter);

  return (
    <section>
      <label>
        Filter by status
        <select value={filter} onChange={handleFilterChange}>
          {filters.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <p>
        Showing {shown.length} of {issues.length} issues
      </p>

      {shown.length === 0 ? (
        <p>No issues to show.</p>
      ) : (
        <ul>
          {shown.map((issue) => (
            <li key={issue._id}>
              <IssueCard issue={issue} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
