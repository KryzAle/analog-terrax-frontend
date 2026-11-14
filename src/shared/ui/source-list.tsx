import { ExternalLink } from "lucide-react";
import type { DataSource } from "@/shared/config/sources";

type SourceListProps = {
  title: string;
  sources: readonly DataSource[];
};

export const SourceList = ({ title, sources }: SourceListProps) => (
  <div className="space-y-2">
    <h3 className="text-xs font-medium text-text-muted">{title}</h3>
    <ul className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <li key={source.name}>
          <a
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-xs text-link transition hover:bg-surface-raised"
          >
            {source.name}
            <ExternalLink className="size-3" strokeWidth={1.5} aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  </div>
);
