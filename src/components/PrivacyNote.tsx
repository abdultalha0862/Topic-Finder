import { EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Reused wherever creator identity is deliberately withheld. Keeping this as one
 * component makes the privacy model consistent and obvious across the app.
 */
export function PrivacyNote({
  className,
  text = "Creator information is hidden",
}: {
  className?: string;
  text?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
    >
      <EyeOff className="size-3.5" />
      {text}
    </span>
  );
}
