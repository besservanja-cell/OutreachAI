import * as React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value = 0, ...props }, ref) => {
  const pct = Math.max(0, Math.min(100, Math.round(value || 0)));
  let innerColor = "bg-green-500";
  if (pct >= 80) {
    innerColor = "bg-red-500";
  } else if (pct >= 60) {
    innerColor = "bg-yellow-400";
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all", innerColor)}
        style={{ transform: `translateX(-${100 - pct}%)` }}
      />
    </div>
  );
});
Progress.displayName = "Progress";

export { Progress };
