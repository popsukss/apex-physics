interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="space-y-2">
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        {completed} / {total} topics
      </p>
    </div>
  );
}
