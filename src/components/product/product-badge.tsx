import { Award, Flame, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProductBadge({ badge, className }: { badge: string | null; className?: string }) {
  if (!badge) return null;
  const lower = badge.toLowerCase();
  if (lower.includes("calidad")) {
    return (
      <Badge variant="value" className={className}>
        <Award aria-hidden /> {badge}
      </Badge>
    );
  }
  if (lower.includes("top") || lower.includes("ventas")) {
    return (
      <Badge variant="top" className={className}>
        <Flame aria-hidden /> {badge}
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className={className}>
      <Tag aria-hidden /> {badge}
    </Badge>
  );
}
