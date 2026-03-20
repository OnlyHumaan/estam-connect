interface StatusBadgeProps {
  status: string;
}

const statusClasses: Record<string, string> = {
  Pending: "status-badge status-pending",
  "Under Review": "status-badge status-under-review",
  "In Progress": "status-badge status-in-progress",
  Resolved: "status-badge status-resolved",
  Closed: "status-badge status-closed",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={statusClasses[status] || "status-badge status-pending"}>
      {status}
    </span>
  );
}
