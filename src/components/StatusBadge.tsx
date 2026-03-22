interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-[hsl(24,95%,53%)]/10 text-[hsl(24,95%,53%)] border-[hsl(24,95%,53%)]/20",
  "Under Review": "bg-warning/10 text-warning border-warning/20",
  "In Progress": "bg-info/10 text-info border-info/20",
  Resolved: "bg-success/10 text-success border-success/20",
  Closed: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
        statusStyles[status] || statusStyles["Pending"]
      }`}
    >
      {status}
    </span>
  );
}
