import type { LucideIcon } from "lucide-react";

type HighlightListViewProps = {
  title: string;
  items: readonly string[];
  emptyText: string;
  icon: LucideIcon;
  color: string;
};

export const HighlightListView = ({ title, items, emptyText, icon: Icon, color }: HighlightListViewProps) => (
  <div className="space-y-2 rounded-tile border border-line p-3.5">
    <h3 className="flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
      <Icon className="size-4" strokeWidth={1.5} aria-hidden />
      {title}
    </h3>
    <ul className="space-y-1.5 text-xs leading-relaxed text-text-muted">
      {(items.length > 0 ? items : [emptyText]).map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);
