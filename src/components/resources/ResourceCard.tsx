import { FileText, Link as LinkIcon, Video, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/data/resources";

interface ResourceCardProps {
  resource: Resource;
}

const typeIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  link: LinkIcon,
  video: Video,
};

const typeLabels: Record<string, string> = {
  pdf: "PDF",
  link: "Link",
  video: "Video",
};

const categoryColors: Record<string, string> = {
  mechanics: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  thermodynamics: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  electromagnetism: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  optics: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "modern-physics": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  general: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const TypeIcon = typeIcons[resource.type] || LinkIcon;
  const typeLabel = typeLabels[resource.type] || resource.type;
  const categoryColor = categoryColors[resource.category] || categoryColors.general;

  const categoryLabel = resource.category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <TypeIcon className="size-3" />
          <span>{typeLabel}</span>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${categoryColor}`}>
          {categoryLabel}
        </span>
      </div>

      <h3 className="mb-2 text-base font-semibold text-foreground">{resource.title}</h3>

      {resource.description && (
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{resource.description}</p>
      )}

      <div className="mt-auto">
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="sm" className="w-full justify-center">
            Open
            <ExternalLink className="size-3" />
          </Button>
        </a>
      </div>
    </div>
  );
}
