type ActivityItem = {
  id: string;
  initials: string;
  name: string;
  action: string;
  time: string;
  dotClassName?: string;
};

type ActivityListProps = {
  items: ActivityItem[];
};

export function ActivityList({ items }: ActivityListProps) {
  return (
    <ul className="divide-y divide-border">
      {items.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
              {entry.initials}
            </span>
            <span>
              <span className="block font-medium">{entry.name}</span>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                {entry.action}
                <span className={`h-2 w-2 rounded-full ${entry.dotClassName ?? "bg-primary"}`} />
              </span>
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{entry.time}</span>
        </li>
      ))}
    </ul>
  );
}
