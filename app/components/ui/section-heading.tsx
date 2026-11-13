import type { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface SectionHeadingProps {
  title: string;
  icon?: ReactNode;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  icon,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("section-heading", className)}>
      <div className="section-heading-main">
        {icon && (
          <div className="section-heading-icon">
            {icon}
          </div>
        )}
        <div className="section-heading-text">
          <h3 className="form-section-title section-heading-title">{title}</h3>
          {description && (
            <p className="form-section-desc section-heading-desc">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="section-heading-actions">
          {action}
        </div>
      )}
    </div>
  );
}
