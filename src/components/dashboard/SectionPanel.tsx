import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SectionPanelProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

const SectionPanel = forwardRef<HTMLDivElement, SectionPanelProps>(
  ({ className, children, noPadding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "premium-panel rounded-xl",
          !noPadding && "p-5",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SectionPanel.displayName = "SectionPanel";

export { SectionPanel };